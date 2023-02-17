const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  name: String,
  menu: [
    {
      name: String,
      price: Number,
    }
  ],
  repreMenu: [String],
  location: String
});

cafeSchema.index({name:'text', 'menu.name':'text', 'menu.price':'text', repreMenu: 'text'})
module.exports = mongoose.model('Cafe', cafeSchema);//모델에 접근