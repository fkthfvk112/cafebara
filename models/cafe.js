const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  images:[
    {
      url:String,
      filename:String
    }
  ],
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
  takeOut:Boolean,
  location: {
    type:String,
    required:true
  },
  latitude:{
    type:Number,
    required:true
  },
  longitude:{
    type:Number,
    required:true
  },
  comment: [{
    image:{
      type:String,
    },
    purpose:{
      type:String,
      enum:['study', 'talk', 'nofeatures']
    },
    rating:{
      taste:Number,
      atmosphere:Number,
      price:Number
    },
    content:String,
    user:{
      type:Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
});

cafeSchema.virtual('ratingAVG').get(function() {
  const comments = this.comment || [];
  const numComments = comments.length;
  const ratings = comments.map(comment => comment.rating ? comment.rating:{ taste: 0, atmosphere: 0, price: 0 });

  const sum = {
    taste: ratings.reduce((total, rating) => total + rating.taste, 0),//total = 누적값, rating = 배열의 현재요소
    atmosphere: ratings.reduce((total, rating) => total + rating.atmosphere, 0),
    price: ratings.reduce((total, rating) => total + rating.price, 0)
  };
  console.log('가상', sum);

  return {
    taste: numComments ? sum.taste / numComments : 0,
    atmosphere: numComments ? sum.atmosphere / numComments : 0,
    price: numComments ? sum.price / numComments : 0
  };
});

module.exports = mongoose.model('Cafe', cafeSchema);//모델에 접근