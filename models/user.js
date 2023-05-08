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

const User = mongoose.model('User', userSchema);
module.exports = User;