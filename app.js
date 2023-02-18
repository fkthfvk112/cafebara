const express = require('express');
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate');//ejs-mate는 ejs의 재사용을 도와줌(boilerplate에 사용)https://www.npmjs.com/package/ejs-mate

const app = express();

const path = require('path');

/*DataBase*/
const Cafe = require('./models/cafe');
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

  app.post('/cafe', async(req, res)=>{//create cafe
    console.log(req.body)
    const cafeElement = req.body.cafe
  
    let menu = {}
    const menuName = req.body.menu.name
    const menuPrice = req.body.menu.price
    const menuArr =[]
    let cnt = 0
    for(let n of menuName){
      menu.name = n
      console.log('n', n)
      menu.price = menuPrice[cnt]
      let temp = Object.assign({}, menu)//얕은 복사, =로 할당시 주소를 그대로 가짐(c의 포인터와 유사)
      cnt++
      menuArr.push(temp)
    }  
    const cafe = new Cafe(cafeElement);
    cafe.menu = menuArr
    await cafe.save();
      
    res.redirect('/cafe');
  })

// app.get('/react', async(req, res)=>{
//   res.sendFile('/react-page.html');
// })

app.get('/react', async(req, res)=>{
  const cafes = await Cafe.find({})
  res.json(cafes);
})

app.delete('/cafe', async(req, res)=>{
    console.log("im here")
    await Cafe.deleteMany({});
    res.redirect('/cafe');
})

app.listen(port, ()=>{
    console.log(`연결 : ${port}`)
})