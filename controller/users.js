const Cafe = require('../models/cafe');
const User = require('../models/user');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


module.exports.sendSignUp = async(req,res)=>{
    res.render('signUp');
  };

module.exports.sendSignIn = async(req,res)=>{
    res.render('signIn');
  };

module.exports.signUp = async(req, res) => {
    try{
      inputedUser = req.body.user;
      const user = new User({
        username: inputedUser.username,
        email: inputedUser.email,
        nickName: inputedUser.nickName
      });
      const registerUser = await User.register(user, inputedUser.password);
      req.login(registerUser, err=>{
        if(err) return next(err);
        res.redirect('/cafe');
      });
    }catch(err){
      console.log('에러', err);
      return next(err)
  }
};

module.exports.signIn = async(req, res)=>{
  try{
    if(req.user){
      const redirectUrl = req.session.returnTo||'/cafe';
      req.session.user = req.user;
  
      delete req.session.returnTo;
      req.flash('success', "환영합니다")
      res.redirect(redirectUrl);
    }
  }
  catch(err){
    console.log("로그인 관련 에러 발생", err);
    return next(err);
  }
};

module.exports.logOut = async(req, res, next)=>{
      req.logout((err)=>{
        console.log(err);
        return next(err);
      })
      res.redirect('/cafe');
    };

module.exports.isLogInAPI = async(req, res)=>{
        if(req.isAuthenticated()){
          res.json({
            isLoggedIn:true,
            user: req.user
          });
        }
        else{
          res.json({
            isLoggedIn:false
          });
        };
      };

module.exports.likeCafe = async(req, res)=>{ //로그인하지 않앗을때 처리 잘 되나?
  

    let heartToggle = 0;

    const userID = req.user&&req.user._id;
    const cafeID = req.params.id;

    const user = await User.findById(userID);
    
    const exist = user&&user.likes.some(cafe => cafe._id.equals(cafeID));
    console.log(exist);
    if(exist){
      await User.updateOne({_id: userID}, {$pull: {likes:cafeID}});
      heartToggle = 0;
    }
    else{
      await User.updateOne({_id:userID}, {$push:{likes:cafeID}});
      heartToggle = 1;
    }
    const user2 = await User.findById(userID); 
    console.log("Like Result ", user2);

  res.send(String(heartToggle));
}


 module.exports.user = async(req, res)=>{
  const userID = req.user&&req.user._id;
  const user = await User.findById(userID)
              .populate('commentedCafe')
              .populate('likes');
  console.log(user);

  const commentArr = [];
  user.commentedCafe.map((cafe)=>{
    for(let cafeCom of cafe.comment){
      if(cafeCom.user.toString() === userID.toString()){
        let tempCafeObj = {
          cafeId:cafe._id,
          cafeName:cafe.name,
          comment:cafeCom.content
        }
        commentArr.push(tempCafeObj);
      }
    }
  })

  //추후 필터 적용하려면 axios
  const likeCafeArr = [];
  user.likes.map(async(cafe)=>{
    likeCafeArr.push(cafe);
  })

    const allUserInfo = {
      nickName:user.nickName,
      email:user.email,
      comments:commentArr,
      likes:likeCafeArr
    }

    console.log("올 아이템, ", allUserInfo);

  res.render('user', {allUserInfo});//클라이언트측 진행
}
