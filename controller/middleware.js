module.exports.isLoggedIn = async(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = await req.originalUrl;
        return res.redirect('/user/signin');
    }
    next();
}