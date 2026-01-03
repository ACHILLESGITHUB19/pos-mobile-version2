const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    brandName: { type: String, 
    required: true 
},
    status: { type: Boolean, 
    default: true 
}
});

module.exports = mongoose.model('Brand', brandSchema);
