const mongoose = require('mongoose');
const Cafe = require('./cafe');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    commentedCafe:[{
        type:Schema.Types.ObjectId,
        ref:'Cafe'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
      }],
    likes:[{
        type: Schema.Types.ObjectId,
        ref: 'Cafe'
    }],
    isBanned: {
        type: Boolean,
        default: false
    },
    warnings: {
        type: Number,
        default: 0
    }
});

userSchema.plugin(passportLocalMongoose);

// userSchema.pre('findOneAndDelete', async function(doc){ 
//     console.log('도큐먼테이션', doc)
//     console.log("아이디", doc._id);
//     console.log("이외, ", doc.nickName);

// })
// userSchema.pre('findOneAndRemove', async(doc, next)=>{
//     const userId = doc._id;
//     console.log("도큐먼트 내용", doc);
//     console.log("우저 아이디", userId);
//     console.log("우저 아이디", userId);
//     try{
//         const userId = doc._id;
//         console.log("우저 아이디2", userId);


//         console.log("우저 아이디", userId);
//         await Cafe.deleteMany({author:userId});
//         next();
//     }
//     catch(err){
//         next(err);
//     }
// })

const User = mongoose.model('User', userSchema);
module.exports = User;