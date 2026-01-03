import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    catName: { type: String, 
    required: true 

},
    status: { type: Boolean, 
    default: true 
}
});

module.exports = mongoose.model('Category', categorySchema);
