if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
const express = require('express');
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate');//ejs-mate는 ejs의 재사용을 도와줌(boilerplate에 사용)https://www.npmjs.com/package/ejs-mate

const app = express();

const path = require('path');

const {isLoggedIn} = require('./controller/middleware')
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

const {storage} = require('./cloudinary');
const multer = require('multer');
const upload = multer({ storage:storage});

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
passport.deserializeUser(User.deserializeUser());//세션의 값을 HTTP Ruest리턴(req.user)

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
app.get('/createCafe', isLoggedIn, (req, res)=>{
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

app.post('/user/signin', passport.authenticate('local', {falureFlash: true,  keepSessionInfo: true, failureRedirect: '/user/login'}), async(req, res)=>{
  if(req.user){
    const redirectUrl = req.session.returnTo||'/cafe';
    req.session.user = req.user;

    delete req.session.returnTo;
    res.redirect(redirectUrl);
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

app.post('/cafe/user/review/create/:id', upload.single('photos'), async(req, res) => {
  console.log("실행됌");
  console.log('파일', req.file);
  console.log("바디", req.body);

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
    image:req.file&&req.file.path,  //에러 발생
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


app.post('/test', upload.array('photos'), (req, res)=>{
  console.log('Good');
  console.log(req.files[0].path);

  res.send(req.files);
})

app.post('/cafe', upload.fields([{name:'photos'}, {name:'repreMenuPhoto'},{name:'menuPhoto'}]), async (req, res) => {
  const cafeData = req.body.cafe;
  const rePreMenuData = req.body.repreMenu;
  const menuData = req.body.menu;
  // menu 배열 생성

  console.log("파일스", req.files);
  console.log("파일스2", req.files.menuPhoto);

  let menu;
  if(Array.isArray(menuData&&menuData.name)){
    menu = menuData && menuData.name.map((name, idx)=>({
      name,
      price:menuData.price[idx],
      description:menuData.description[idx]&&menuData.description[idx],
      imgUrl:req.files.menuPhoto[idx]&&req.files.menuPhoto[idx].path,
      filename:req.files.menuPhoto[idx]&&req.files.menuPhoto[idx].filename
    }))
  }
  else{
    menu = menuData;
  }

  let repreMenu;
  if(Array.isArray(rePreMenuData&&rePreMenuData.name)){
      repreMenu = rePreMenuData && rePreMenuData.name.map((name, idx)=>({
      name,
      price:rePreMenuData.price[idx],
      description:rePreMenuData.description[idx]&&rePreMenuData.description[idx],
      imgUrl:req.files.repreMenuPhoto[idx]&&req.files.repreMenuPhoto[idx].path,
      filename:req.files.repreMenuPhoto[idx]&&req.files.repreMenuPhoto[idx].filename
    }))
  }
  else{
    repreMenu = rePreMenuData;
  }

  const cafeImages = req.files.photos.map(f =>({url:f.path, filename:f.filename}));

  const cafe = new Cafe({
    images:cafeImages,
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
  console.log('카페', cafe);
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