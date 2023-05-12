const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  author:{
    type:Schema.Types.ObjectId,
    ref: 'User'
  },
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
  description:{
    type:String,
    required:true
  },
  menu: [
    {
      name: String,
      price: Number,
      imgUrl:String,
      filename:String,
      description:String
    }
  ],
  repreMenu: [
    {
      name:String,
      imgUrl:String,
      filename:String,
      description:String,
      price:Number
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
    filename:String,
    totalPurpose:String,
    purpose:{
      type:String,
      enum:['study', 'talk', 'takeOut', 'nofeatures']
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

// cafeSchema.post('save', async(doc, next)=>{
//   let cntStudy = 0;
//   let cntTalk = 0;
//   let cntTakeOut = 0;
//   let cntNofeatures =0;

//   console.log(doc);
//   let purposeArr = [cntStudy, cntTalk, cntTakeOut, cntNofeatures];

//   doc.comment.forEach(ele=>{
//     if(ele.purpose == 'study') cntStudy++;
//     if(ele.purpose == 'talk') cntTalk++;
//     if(ele.purpose == 'takeOut') cntTakeOut++;
//     if(ele.purpose == 'nofeatures') cntNofeatures++;
//   })

//   let maxInx = 0;
//   let maxVal = 0;
//   for(let i = 0; i < purposeArr.length; i++){
//     if(maxVal < purposeArr[i]){
//       maxVal = purposeArr[i];
//       maxInx = i;
//     }
//   }

//   let ans = "";
//   switch(maxInx){
//     case 0:
//       ans = 'study'
//       break;
//     case 1:
//       ans = 'talk'
//       break
//     case 2:
//       ans = 'takeOut'
//       break;

//     case 3:
//       ans = 'nofeatures'
//       break;
//     default:
//       ans = 'talk'
//   }
//   doc.totalPurpose = ans;
//   doc.markModified(doc.totalPurpose)
//   next();
// })

cafeSchema.virtual('ratingAVG').get(function(){
  const comments = this.comment || [];
  const numComments = comments.length;
  const ratings = comments.map(comment => comment.rating ? comment.rating:{ taste: 0, atmosphere: 0, price: 0 });

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



cafeSchema.virtual('ratingAVGtotal').get(function(){
  const comments = this.comment || [];
  const numComments = comments.length;
  const ratings = comments.map(comment => comment.rating ? comment.rating:{ taste: 0, atmosphere: 0, price: 0 });

  const sum = {
    taste: ratings.reduce((total, rating) => total + rating.taste, 0),//total = 누적값, rating = 배열의 현재요소
    atmosphere: ratings.reduce((total, rating) => total + rating.atmosphere, 0),
    price: ratings.reduce((total, rating) => total + rating.price, 0)
  };

  const rating = {
    taste: numComments ? sum.taste / numComments : 0,
    atmosphere: numComments ? sum.atmosphere / numComments : 0,
    price: numComments ? sum.price / numComments : 0
  };
  
  const totalRating = (rating.taste + rating.atmosphere + rating.price)/3;

  return totalRating;
});

cafeSchema.virtual('reviewCnt').get(function(){
  const reviewCnt = this.comment.length;
  return reviewCnt;
})


module.exports = mongoose.model('Cafe', cafeSchema);//모델에 접근