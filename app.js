if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
const express = require('express');
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate');//ejs-mate는 ejs의 재사용을 도와줌(boilerplate에 사용)https://www.npmjs.com/package/ejs-mate

const app = express();

const path = require('path');

/*DataBase*/
const Cafe = require('./models/cafe');
const User = require('./models/user');
const dbUrl = process.env.DBURL;


const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const port = process.env.PORT || 8080;

const flash = require('express-flash');
const cookieParser = require('cookie-parser');

const cafeRoutes = require('./routes/cafe');
const userRoutes = require('./routes/user');
const { createProxyMiddleware } = require('http-proxy-middleware');//react cors처리
const helmet = require('helmet');

//dbUrl
//"mongodb://127.0.0.1:27017/Cafe"
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl)
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
app.use(express.static(__dirname + '/public/client-react/build'));


//origin: '*',
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

app.use(cookieParser('keyboard cat'));

app.use(flash());

app.use(helmet({
    contentSecurityPolicy : false,
    crossOriginEmbedderPolicy : false
}));

app.use('/cafe', cafeRoutes)
app.use('/user', userRoutes)



app.get('/map', (req, res)=>{
  res.render('map');
})


/* have to edit */
app.get('/searched_cafe', async(req, res)=>{ 
  const searchTerm = req.query.searchingData;
  const results = await Cafe.find({
    $or:[
      {name:{ $regex : searchTerm, $options:'i'}},
      {"menu.name":{ $regex : searchTerm, $options:'i'}},
      {"repreMenu.name":{ $regex : searchTerm, $options:'i'}}
    ]
  }).sort({score:{$meta : 'textScore'}})
    .select({ score: { $meta: 'textScore' } });
    
  res.render('cafe', {cafes:results})
})

app.use((err, req, res, next)=>{
  req.flash("error", `에러가 발생하였습니다.\n ${err}`);
  res.redirect('/cafe');
})

app.delete('/cafe', async(req, res)=>{
    await Cafe.deleteMany({});
    res.redirect('/cafe');
})

app.get('/cafe/:id', (req, res)=>{
  res.sendFile('/public/client-react/build/index.html', {root:'.'})
})


app.get('/', (req, res)=>{
  res.render('home')
});

app.get('/temp', (req, res)=>{
  res.render('temp');
})
// app.get('/cafe/:id', (req, res)=>{
//   res.render(__dirname + '/buld/index.ejs')
// })

app.listen(port, ()=>{
    console.log(`연결 : ${port}`)
})