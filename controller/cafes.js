const Cafe = require('../models/cafe');
const {storage} = require('../cloudinary');
const {cloudinary} = require('../cloudinary')

module.exports.showCafes = async(req, res)=>{
    const cafes = await Cafe.find({});
    res.render('cafe', {cafes});
};

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
    const cafe = await Cafe.updateOne(
      {_id:req.params.id},
      {$pull:{comment:{_id:comment_id}}}
    )
    res.send('Delete ok');
  };

module.exports.createReview = async(req, res) => {
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
    await cafe.save()
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
