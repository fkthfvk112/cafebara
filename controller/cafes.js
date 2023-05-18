const Cafe = require('../models/cafe');
const User = require('../models/user');
const {storage} = require('../cloudinary');
const {cloudinary} = require('../cloudinary')
const mongoose = require('mongoose');

module.exports.showCafes = async(req, res)=>{
    let cafes = await Cafe.find({});
    cafes.forEach((cafe)=>{
      const ratingAVGtotal = cafe.ratingAVGtotal;
      const purposeTotal = cafe.purposeTotal;
      cafe.avgTotal = ratingAVGtotal;
      cafe.purposeTotal = purposeTotal;
    })
    res.render('cafe', {cafes});
};

module.exports.cafe = (req, res)=>{
  
}

module.exports.creatCafe = async (req, res, next) => {
    try{
      const cafeData = req.body.cafe;
      const rePreMenuData = req.body.repreMenu;
      const menuData = req.body.menu;
      const authorID = req.user&&req.user._id;
  
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
      author:authorID,
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
    }
    catch(err){
      return next(err);
    }
    res.redirect('/cafe');
  };

module.exports.cafeDataApi = async(req, res)=>{
    const cafe = await Cafe.findById(req.params.id)
    .populate('author')
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
  }

module.exports.ratingApi = async(req, res)=>{
    const cafe = await Cafe.findById(req.params.id);
    const ratings = cafe?cafe.ratingAVG:0;
  
    res.json(ratings);
  }

module.exports.sendCreateCafe = (req, res)=>{
    res.render('createCafe');
}

module.exports.deleteReview = async(req, res)=>{
    const comment_id = req.body.commentID;
    const userId = req.user&&req.user._id;

    await Cafe.updateOne(
      {_id:req.params.id},
      {$pull:{comment:{_id:comment_id}}}
    )

    await User.updateOne(
      {_id:userId},
      {$pull: {comments: comment_id}}
    )

    res.send('Delete ok');
  };
  

module.exports.createReview = async(req, res) => {
    const id = req.params.id;
    const comment = req.body.comment;
    const userID = req.body.userID;
  
    const cafe = await Cafe.findById(id);
    const user = await User.findById(userID);
    const tasteRate = req.body.tasteRate;
    const atmosRate = req.body.atmosRate;
    const priceRate = req.body.priceRate;
    let atmos;


    if(req.body.study === 'true'){
      atmos = 'study';
    }
    else if(req.body.talk === 'true'){
      atmos = 'talk';
    }
    else{
      atmos = 'nofeatures'
    }  
    const tempComment = {
      image:req.file&&req.file.path,
      filename:req.file&&req.file.filename,
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
    const commentId = cafe.comment[cafe.comment.length-1]._id;
    const cafeId = cafe._id;
    user.comments.push(commentId);

    let isIn = false;
    for(let commentedCafeId of user.commentedCafe){
      if(commentedCafeId.toString() === id){
          isIn = true;
      }
    }
    if(!isIn){
      user.commentedCafe.push(cafe._id);
    }

    await cafe.save();
    await user.save();
    res.send('Success!');
  };


  const destroyImages = (parentOfImages) =>{
    if(parentOfImages){
      for(let element of parentOfImages){
        if(element.filename) cloudinary.uploader.destroy(element.filename)
      }
    }
  }

module.exports.deleteCafe = async (req, res)=>{
  const id = req.params.id;
  const cafe = await Cafe.findById(id);

  for(let img of [cafe.images, cafe.repreMenu, cafe.menu, cafe.comment]){
    destroyImages(img);
  }
  
  await Cafe.findByIdAndDelete(id);

  res.send('Delete Cafe Completed!');
};

module.exports.editCafePage = async(req, res)=>{
  const id = req.params.id;
  const cafe = await Cafe.findById(id);

  res.render('editCafe', {cafe});
}

module.exports.editCafe = async(req, res, next)=>{//have to edit
   try{
    const cafeData = req.body.cafe;
    const rePreMenuData = req.body.repreMenu;
    const menuData = req.body.menu;
    const authorID = req.user&&req.user._id;

    let menu;
    if(Array.isArray(menuData&&menuData.name)){//2개 이상(배열)
      menu = menuData && menuData.name.map((name, idx)=>({
        name,
        price:menuData.price[idx],
        description:menuData.description[idx]&&menuData.description[idx],
        //imgUrl:req.files.menuPhoto[idx]&&req.files.menuPhoto[idx].path,
        //filename:req.files.menuPhoto[idx]&&req.files.menuPhoto[idx].filename
      }))
    }
    else{
      if(menuData === undefined){//0개
        menu = [];
      }
      else{//1개
        menu = [menuData];
      }
    }

    let repreMenu;
    if(Array.isArray(rePreMenuData&&rePreMenuData.name)){
        repreMenu = rePreMenuData && rePreMenuData.name.map((name, idx)=>({
        name,
        price:rePreMenuData.price[idx],
        description:rePreMenuData.description[idx]&&rePreMenuData.description[idx],
        //imgUrl:req.files.repreMenuPhoto[idx]&&req.files.repreMenuPhoto[idx].path,
        //filename:req.files.repreMenuPhoto[idx]&&req.files.repreMenuPhoto[idx].filename
      }))
    }
    else{
      repreMenu = rePreMenuData;
    }

    //const cafeImages = req.files&&req.files.photos.map(f =>({url:f.path, filename:f.filename}));
    const preCafe = await Cafe.findById(req.params.id);
    const postCafe = req.body.cafe;
    

    // console.log("이전", preCafe);
    // console.log("이후", postCafe);



    /*repreMenu update*/
    let preLength = preCafe.repreMenu.length;
    for(let i = 0; i < repreMenu.length; i++){
      const nameKey = `repreMenu.${i}.name`;
      const priceKey = `repreMenu.${i}.price`;
      const descriptionKey = `repreMenu.${i}.description`;

      const eqName = preCafe.repreMenu[i] ? preCafe.repreMenu[i].name === repreMenu[i].name: false;
      const eqPrice = preCafe.repreMenu[i] ?preCafe.repreMenu[i].price === repreMenu[i].price:false;
      const eqDescription = preCafe.repreMenu[i] ?preCafe.repreMenu[i].description === repreMenu[i].description:false;
      if(!eqName ||!eqPrice||!eqDescription){
        await Cafe.updateOne({_id:req.params.id}, {$set:{
          [nameKey]:repreMenu[i].name,
          [priceKey]:repreMenu[i].price,
          [descriptionKey]:repreMenu[i].description
        }}, {upsert:true})
      }
    }

    /*menu update*/
    let preMenuLength = preCafe.menu.length;
    if(menu.length !== 0){
        for(let i = 0; i < menu.length; i++){
          const nameKey = `menu.${i}.name`;
          const priceKey = `menu.${i}.price`;
          const descriptionKey = `menu.${i}.description`;

          const eqName = preCafe.menu[i]?preCafe.menu[i].name === menu[i].name:false;
          const eqPrice = preCafe.menu[i]?preCafe.menu[i].price === menu[i].price:false;
          const eqDescription = preCafe.menu[i]?preCafe.menu[i].description === menu[i].description:false;
          if(!eqName ||!eqPrice||!eqDescription){
            await Cafe.updateOne({_id:req.params.id}, {$set:{
              [nameKey]:menu[i].name,
              [priceKey]:menu[i].price,
              [descriptionKey]:menu[i].description
            }}, {upsert:true})
          }
        }

        for(let i = 0; i < preMenuLength-menu.length; i++){
          await Cafe.updateOne({_id:req.params.id}, {$pop:{menu: 1}});
        }
    }
    else{
      for(let i = 0; i < preMenuLength; i++){
        await Cafe.updateOne({ _id: req.params.id }, { $pop: { menu: 1 } });
      }
    }
    
  }
  catch(err){
    return next(err);
  }
  res.redirect('/cafe');
}
//'study', 'talk', 'takeOut', 'nofeatures'] have to eidt
const filterAtmos = (documents, atmos)=>{
  if(atmos==="") return documents;
  const newCafeArr = documents.filter((cafe)=>{
    if(cafe.purposeTotal === atmos) return true;
    else return false;
  })

  return newCafeArr;
  /* version 1 below without virtual field*/
  // const newCafeArr = documents.filter((cafe)=>{
  //   let atmosCnt = {
  //     study:0,
  //     talk:0,
  //     takeOut:0,
  //     cntNofeatures:0
  //   }
  //   const comment = cafe.comment;
  //   for(let i = 0; i < comment.length; i++){
  //       if(comment[i].purpose ==="study") atmosCnt.study++;
  //       else if(comment[i].purpose ==="talk") atmosCnt.talk++;
  //       else if(comment[i].purpose ==="takeOut") atmosCnt.takeOut++;
  //       else atmosCnt.cntNofeatures++;
  //   }
  //   if(Math.max(atmosCnt.study, atmosCnt.talk, atmosCnt.takeOut, atmosCnt.cntNofeatures)===atmosCnt[atmos]){
  //     return true;
  //   }
  //   return false;
  // })
  // return newCafeArr;
}

const sortByRatingDec = (documents)=>{
  documents.sort((a, b)=> b.ratingAVGtotal - a.ratingAVGtotal);
}

const sortByRatingAsc = (documents)=>{
  documents.sort((a, b)=> a.ratingAVGtotal - b.ratingAVGtotal);
}

const sortByReviewHigh = (documents)=>{
  documents.sort((a, b)=> b.reviewCnt - a.reviewCnt);
}

const sortByReviewLow = (documents)=>{
  documents.sort((a, b)=> a.reviewCnt - b.reviewCnt);
}

const sortByCloseLocationAsc = (documents, myLocation)=>{
  if(myLocation ==="") return;
  documents.sort((a, b)=>{
    const dLatitudeA = myLocation.latitude - a.latitude;
    const dLongitudeA = myLocation.longitude - a.longitude;
    const euclideanA = Math.sqrt(Math.pow(dLatitudeA, 2) + Math.pow(dLongitudeA, 2));

    const dLatitudeB = myLocation.latitude - b.latitude;
    const dLongitudeB = myLocation.longitude - b.longitude;
    const euclideanB = Math.sqrt(Math.pow(dLatitudeB, 2) + Math.pow(dLongitudeB, 2));
    return euclideanA - euclideanB;
  })
}

module.exports.filteredCafe = async(req, res)=>{
  const filter = req.query.filter;
  const searchTerm = filter.filterInput;
  const filter1 = filter.filter1;
  const filter2 = filter.filter2;
  const userLocation = filter.userLocation;
//구현하기 purpose구해서 해당하는 것만 취하기 map에서 return true or false로


  let cafes = await Cafe.find({
    $or:[
      {name:{ $regex : searchTerm, $options:'i'}},
      {"menu.name":{ $regex : searchTerm, $options:'i'}},
      {"repreMenu.name":{ $regex : searchTerm, $options:'i'}}
    ]
  }).sort({score:{$meta : 'textScore'}}).select({ score: { $meta: 'textScore' } })

  cafes.forEach((cafe)=>{
    const ratingAVGtotal = cafe.ratingAVGtotal;
    const purposeTotal = cafe.purposeTotal;
    cafe.avgTotal = ratingAVGtotal;
    cafe.purposeTotal = purposeTotal;
  })

  cafes = filterAtmos(cafes, filter1);
  switch(filter2){
    case "highStar":
      sortByRatingDec(cafes);
      break;
    case "lowStar":
      sortByRatingAsc(cafes);
      break;
    case "highReview":
      sortByReviewHigh(cafes);
      break;
    case "lowReview":
      sortByReviewLow(cafes);
      break;
    case "closeToMe":
      sortByCloseLocationAsc(cafes, JSON.parse(userLocation));
      break;
  }


  res.render('cafe', {cafes});
}