const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { 
    type: String, 
    required: true 
},
    description: { 
    type: String 
},
    price: { 
    type: Number, 
    required: true 
},
    status: { 
    type: Boolean, 
    default: true 
},
    category: { type: Schema.Types.ObjectId, 
    ref: 'Category' 
},
    brand: { type: Schema.Types.ObjectId, 
    ref: 'Brand' 
}
});

module.exports = mongoose.model('Product', productSchema);
