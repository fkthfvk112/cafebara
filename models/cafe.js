const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  name: {
    type:String,
    required:true,
    unique:true
  },
  menu: [
    {
      name: String,
      price: Number,
    }
  ],
  description:{
    type:String,
    required:true
  },
  repreMenu: [
    {
      name:String,
      //img:String,
      //required:true
    }
  ],
  purpose:{
    type:String,
    enum:['study', 'talk', 'nofeatures']
  },
  location: {
    type:String,
    required:true
  },
  comment: [{
    content:String,
    user:{
      type:Schema.Types.ObjectId,
      ref: 'User'
    },
    content:String,
    replies:[{
      user:{
        type:Schema.Types.ObjectId,
        ref: 'User'
      },
    }]
  }]
});

module.exports = mongoose.model('Cafe', cafeSchema);//모델에 접근