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

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use(cors())

/* body-parser */
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.render('home')
});

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

app.get('/cafe/api/:id', async(req, res)=>{
  const cafe = await Cafe.findById(req.params.id).populate({
    path: 'comment',
    populate: {
      path: 'user replies.user',
      model: 'User'
    }
  });
  console.log('api의 카페', cafe);
  res.json(cafe)
})

app.post('/cafe/user/review/create/:id', async(req, res) => {
  const id = req.params.id;
  const comment = req.body.comment;

  const cafe = await Cafe.findById(id);
  console.log('디비', cafe);

  const tempComment = { //have to edit //add user id!!
    content:comment
  }
  cafe.comment.push(tempComment);
  await cafe.save()

  res.send('Success!');
});

// app.get('/react', async(req, res)=>{
//   const cafes = await Cafe.find({})
//   res.json(cafes);
// })

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
    repreMenu: repreMenu
  });

  await cafe.save();
  res.redirect('/cafe');
});

// app.get('/react', async(req, res)=>{
//   res.sendFile('/react-page.html');
// })



app.delete('/cafe', async(req, res)=>{
    console.log("im here")
    await Cafe.deleteMany({});
    res.redirect('/cafe');
})

app.listen(port, ()=>{
    console.log(`연결 : ${port}`)
})