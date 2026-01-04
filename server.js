/* ================= IMPORTS ================= */
import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB, User, Product, Category } from "./config/database.js";
import categoryRoutes from "./routes/categoryroute.js";
import productRoutes from "./routes/productroute.js";

/* ================= ENV ================= */
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in .env");
}

/* ================= APP ================= */
const app = express();
await connectDB();

/* ================= MIDDLEWARE ================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));
app.set("view engine", "ejs");

/* ================= API ROUTES ================= */
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

/* ================= PAGE ROUTES ================= */
const pages = [
  "login", "register"
];

pages.forEach(page => {
  app.get(`/${page.toLowerCase()}`, (req, res) => res.render(page));
});

/* ================= AUTH MIDDLEWARE ================= */
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.clearCookie("token");
    res.redirect("/login");
  }
};

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { user, pass, role } = req.body;

    if (!user || !pass) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const existingUser = await User.findOne({ username: user });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(pass, 10); // synchronous hash
    const newUser = new User({
      username: user,
      password: hashedPassword,
      role: role || "staff",
    });

    await newUser.save();
    res.status(201).json({ message: "Username registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;

    const existingUser = await User.findOne({ username: user });
    if (!existingUser) return res.status(404).send("User not found");

    const isMatch = bcrypt.compareSync(pass, existingUser.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    const token = jwt.sign(
      {
        id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 365 days
    });

    if (existingUser.role === "admin") return res.redirect("/admindashboard");
    res.redirect("/staffdashboard");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).send("Login error");
  }
});

/* ================= DASHBOARDS ================= */
app.get("/admindashboard", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.redirect("/staffdashboard");

  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find({}, "stock").lean();
    const totalStocks = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    const totalOrders = await Order.countDocuments();

    const stats = { totalStocks, totalProducts, totalOrders };

    res.render("admindashboard", { user: req.user, stats });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.render("admindashboard", {
      user: req.user,
      stats: { totalStocks: 0, totalProducts: 0, totalOrders: 0 }
    });
  }
});

app.get("/staffdashboard", verifyToken, async (req, res) => {
  if (req.user.role !== "staff") return res.redirect("/admindashboard");

  try {
    const categories = await Category.find().lean();
    const products = await Product.find().lean();

    res.render("staffdashboard", { user: req.user, categories, products });
  } catch (err) {
    console.error("STAFF DASHBOARD ERROR:", err);
    res.status(500).send("Server Error");
  }
});

/* ================= LOGOUT ================= */
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 9090;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
