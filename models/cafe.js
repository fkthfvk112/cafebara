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
  // ratingAVG:{
  //   type:{
  //     taste:Number,
  //   astmosephere:Number,
  //   price:Number
  //   }
  // },
  comment: [{
    rating:{
      taste:Number,
      astmosephere:Number,
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
  const ratings = comments.map(comment => comment.rating || { taste: 0, atmosphere: 0, price: 0 });

  const sum = {
    taste: ratings.reduce((total, rating) => total + rating.taste, 0),//total = 누적값, rating = 배열의 현재요소
    atmosphere: ratings.reduce((total, rating) => total + rating.atmosphere, 0),
    price: ratings.reduce((total, rating) => total + rating.price, 0)
  };

  return {
    taste: numComments ? sum.taste / numComments : 0,
    atmosphere: numComments ? sum.atmosphere / numComments : 0,
    price: numComments ? sum.price / numComments : 0
  };
});

module.exports = mongoose.model('Cafe', cafeSchema);//모델에 접근