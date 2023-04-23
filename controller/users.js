
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