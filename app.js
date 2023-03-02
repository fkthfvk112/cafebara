const express = require('express');
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate');//ejs-mate는 ejs의 재사용을 도와줌(boilerplate에 사용)https://www.npmjs.com/package/ejs-mate

const app = express();

const path = require('path');

/*DataBase*/
const Cafe = require('./models/cafe');
const User = require('./models/user');

const mongoose = require('mongoose');
const { string } = require('joi');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const port = process.env.PORT || 8080;


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/Cafe")
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

  /*view*/
  
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
/* body-parser */
app.use(express.json());
app.use(express.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//사용자 정보 세션에 저장
passport.deserializeUser(User.deserializeUser());//세선의 값을 HTTP Ruest리턴(req.user)

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  next();
})



app.get('/', (req, res)=>{
    res.render('home')
});

app.get('/map', (req, res)=>{
  res.render('map');
})
app.get('/createCafe', (req, res)=>{
    res.render('createCafe');
})

app.get('/cafe', async(req, res)=>{
    const cafes = await Cafe.find({});
    res.render('cafe', {cafes});
})

app.get('/cafe/:id', async(req, res)=>{
  //res.send(cafes)
  res.sendFile(path.join(__dirname, '/public/client-react/build/index.html'));
})

app.get('/aaa', async(req, res)=>{ //for check something
  res.send(req.user);
})

app.get('/user/api/islogIn', async(req, res)=>{
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
})

app.get('/cafe/api/:id', async(req, res)=>{
  const cafe = await Cafe.findById(req.params.id)
  .populate('menu')
  .populate('repreMenu')
  .populate({
    path: 'comment',
    populate: {
      path: 'user',
      model: 'User',
      select: '-password' // 유저 데이터 중 password 필드는 제외
    }
  });

  res.json(cafe)
})

app.get('/cafe/api/totalRating/:id', async(req, res)=>{
  const cafe = await Cafe.findById(req.params.id);
  const ratings = cafe?cafe.ratingAVG:0;

  res.json(ratings);
})

app.get('/user/signup', async(req,res)=>{
  res.render('signUp');
})

app.get('/user/signin', async(req,res)=>{
  res.render('signIn');
})


app.post('/user/signup', async(req, res) => {
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
    }catch(e){
      console.log(e);
  }
});

app.post('/user/signin', passport.authenticate('local', {falureFlash: true, failureRedirect: '/user/login'}), async(req, res)=>{
  if(req.user){
    req.session.user = req.user;
    res.redirect('/cafe');
  }
  else{
    res.redirect('/user/login');
  }
})

app.get('/user/logout', async(req, res, next)=>{
  req.logout((err)=>{
    console.log(err);
    return next(err);
  })
  res.redirect('/cafe');
})

app.post('/cafe/user/review/create/:id', async(req, res) => {
  const id = req.params.id;
  const comment = req.body.comment;
  const userID = req.body.userID;
  const cafe = await Cafe.findById(id);
  const tasteRate = req.body.tasteRate;
  const atmosRate = req.body.atmosRate;
  const priceRate = req.body.priceRate;
  let atmos;
  if(req.body.study){
    atmos = 'study';
  }
  else if(req.body.talk){
    atmos = 'talk';
  }
  else{
    atmos = 'nofeatures'
  }
  const tempComment = { //have to edit //add user id!!
    user:userID,
    content:comment,
    purpose:atmos,
    rating:{
      taste:tasteRate,
      atmosphere:atmosRate,
      price:priceRate
    }
  }

  cafe.comment.push(tempComment);
  await cafe.save()
  res.send('Success!');
});

app.post('/cafe/user/review/delete/:id', async(req, res)=>{
  const comment_id = req.body.commentID;
  const cafe = await Cafe.updateOne(
    {_id:req.params.id},
    {$pull:{comment:{_id:comment_id}}}
  )
  res.send('Delete ok');
})
app.get('/searched_cafe', async(req, res)=>{
  const searchTerm = req.query.searchingData;
  const results = await Cafe.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { 'menu.name': { $regex: searchTerm, $options: 'i' } },
      { repreMenu: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ score: { $meta: 'textScore' } })
    .select({ score: { $meta: 'textScore' } }); // $meta projection 추가

  res.render('cafe', {cafes:results})
})

app.post('/cafe', async (req, res) => {
  const cafeData = req.body.cafe;
  // menu 배열 생성
  
  const menu = cafeData.menu && cafeData.menu.map((menuItem) => ({
    name: menuItem.name,
    price: menuItem.price,
  }));
  console.log('대표메뉴', cafeData.repreMenu);
  
  const repreMenu = cafeData.repreMenu && cafeData.repreMenu.map((repreItem)=>({
    name:repreItem
  }))

  const cafe = new Cafe({
    name: cafeData.name,
    menu: menu,
    description: cafeData.description,
    purpose: cafeData.purpose,
    location: cafeData.location,
    latitude: cafeData.latitude,
    longitude: cafeData.longitude,
    repreMenu: repreMenu
  });

  await cafe.save();
  res.redirect('/cafe');
});

// app.get('/react', async(req, res)=>{
//   res.sendFile('/react-page.html');
// })



app.delete('/cafe', async(req, res)=>{
    await Cafe.deleteMany({});
    res.redirect('/cafe');
})

app.listen(port, ()=>{
    console.log(`연결 : ${port}`)
})