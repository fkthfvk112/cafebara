
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
//import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import {NavBar} from './Navigation';
import {StarRating} from './starRating';
import { KakaoMap } from './kakaoMap';
import {FirstPageCarousel} from './FirstPageCarousel';
import {KakaoShareBtn} from './kakaoShareBtn'; 
import {Home} from './Home';
import React, { useState, useEffect } from 'react';
const grayColor = '#edede9';
axios.defaults.withCredentials = true;

function PageOne(probs){
  const [ratings, setRatings] = useState();
  const [heart, setHeart] = useState(0);
  const [copyMessage, setCopyMessage] = useState(false);

  const handleAtmos = ()=>{
    let cntStudy = 0;
    let cntTalk = 0;
    let cntElse = 0;
    let cntTakeOut = 0;
    try{
      for(let data of probs.cafeData.comment){
        if(data.purpose == 'study') cntStudy +=1;
        if(data.purpose == 'talk') cntTalk +=1;
        if(data.purpose == 'takeOut') cntTakeOut +=1;
        else cntElse +=1
      }
      if(cntTalk >= cntStudy && cntTalk >= cntElse && cntTalk >= cntTakeOut){
        return 'talk';
        // setAtmos('talk');
      }
      else if(cntStudy > cntTalk && cntStudy >= cntElse && cntStudy > cntTakeOut){
        return 'study';
        // setAtmos('study');
      }
      else if(cntTakeOut > cntStudy && cntTakeOut > cntTalk && cntTakeOut >= cntElse){
        return 'takeOut'
      }
      else return '기타';
      // else setAtmos('???');
    }
    catch(e){
      console.log(e);
    }
    
  }

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const response = await axios.get(`https://yammycafe.fly.dev/cafe/api/totalRating/${probs.id}`);
        setRatings(response.data);

        const heartToggle = await axios.get(`https://yammycafe.fly.dev/user/checkLike/${probs.id}`);
        setHeart(heartToggle.data);
      }
      catch(e){
        console.log(e);
      }
    }
    fetchData();
  }, [probs]);
  const totalRatingAvg = ratings?(((ratings.taste + ratings.atmosphere + ratings.price)/3).toFixed(2)):0;

  function setRatingText(rating){
    let resultText = "";
    switch(true){
      case (rating < 1):
        resultText = "평가 없음"
        break;
      case (rating < 1.5):
        resultText = "Poor"
        break;
      case (rating <= 2.5):
        resultText = "Not Bad"
        break;
      case (rating <= 3.5):
        resultText = "Normal"
        break;
      case (rating <= 4.5):
        resultText = "Excellent"
        break;
      case (rating <= 5):
        resultText = "Perfect"
        break;
    }
    return resultText;
  }


  const [heartMessage, setHeartMessage] = useState();
  const handleHeartBtn  = async()=>{
    console.log("하트 ")
        try{
          if(probs.isLoggedIn){
            const fetchedData = await axios.get(`https://yammycafe.fly.dev/user/like/${probs.id}`);
            setHeart(fetchedData.data);
            console.log("하트 ", fetchedData.data)
          }
          else{
            setHeartMessage(<div class="hearMessageOn">로그인을 해주세요!</div>)
            setTimeout(()=>{
              setHeartMessage()
            }, 1000)
          }
        }
        catch(e){
          console.log(e);
        }
    }

  const handleCopyBtn = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyMessage(true);
    
    if (setCopyMessage){
      setTimeout(()=>{
        setCopyMessage(false);
      }, 1500);
    }
  }

  const handleKakaoShare = ()=>{
    window.Kakao.Share.createDefaultButton();
    console.log(window.Kakao.Share);
  }  
  
  const images = probs.cafeData?probs.cafeData.images:[{url:''}];
  return(
    <div className="row" style={{width:'50vw', maxWidth:'850px', minWidth:'360px'}} >
      <div className="d-flex justify-content-center">
        <FirstPageCarousel images={images} className="row pt-3 pb-3" style={{width: '50%'}}/>{/*1번항목*/}
      </div>
      <div className="row mt-3 pt-3 pb-3" style={{borderTop:`2px solid ${grayColor}`}}>{/*2번항목*/}
        <div className="col-3 ms-4 d-flex flex-column align-items-center justify-content-center">
          <div>
            <StarRating value={totalRatingAvg} size={25}/>
            <div>
              <span className="fw-bold fs-3 me-2" style={{ marginTop: '0.75rem' }}>{totalRatingAvg}</span>
              <span className="badge text-bg-primary">{setRatingText(totalRatingAvg)}</span>
            </div>
          </div>
          <div style={{marginTop:'1.5rem'}}>분위기</div>
          <div style={{backgroundColor:'#219ebc', color:'white', padding:'0 1rem 0 1rem', borderRadius:'1rem', marginTop:'0.5rem', minWidth:'4.5em'}}>
            {handleAtmos()}
          </div>
        </div>
        <div className="offset-1 col-7">
          <div className="row">{/*댓글*/}
            <div className='text-end' style={{position:'relative'}}>
              <button onClick={handleHeartBtn} className ={`mb-3 heartBtn`}>
                {heart===1?"❤":"🤍"} Like
              </button>
              {heartMessage}
            </div>
            <span className='text-start'>{probs.cafeData?probs.cafeData.description:'No'}</span>{/*카페설명*/}
          </div>
        </div>
      </div>

      <div className='pt-3 pb-3 text-center' style={{borderTop:`2px solid ${grayColor}`}}>{/*3번항목*/}
          <button className='shareBtn sharBtnA' onClick={handleCopyBtn}>📎</button>
          <KakaoShareBtn/>
          <div className="d-flex justify-content-center">
            {copyMessage?<div className='copyMessage'> URL 복사 완료!</div>:<div className='copyMessageEmpty'>&nbsp;</div>}
          </div>
      </div>
    </div>
  )
}

function PageTwoSectionOne(probs){
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);

  const [ratings, setRatings] = useState(null);

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const response = await axios.get(`https://yammycafe.fly.dev/cafe/api/totalRating/${id}`);
        setRatings(response.data);
      }
      catch(e){
        console.log(e);
      }
    }
    fetchData();
  }, [id, probs.isCommentUpdated]);

  function ProgressBar(probs){
    const value = (probs.rate).toFixed(2);
    const percentage_num = (probs.rate/5*100).toFixed(2);
    const percentage =`${percentage_num}%`;

    return(
      <div className="progress w-50 col-6 offset-1" role="progressbar" aria-valuemax="5" style={{padding:'0px'}}>
      <div className="progress-bar" style={{width: percentage}}>{value}</div>
      </div>
    )
  }
  const totalRatingAvg = ratings?(((ratings.taste + ratings.atmosphere + ratings.price)/3).toFixed(2)):0;

  return(
    <div className="d-flex align-items-center justify-content-center ">
      <Container className="row mt-3 pt-3 pb-3 mb-3 text-center" style={{border:`2px solid ${grayColor}`, minWidth: '360px', maxWidth:'850px', width: '50vw' }}>{/*2번항목*/}
        <div className="col-3 d-flex flex-column align-items-center justify-content-center">
            <div className='fw-bold fs-4 text-center'>{totalRatingAvg}/5.00</div>
            <StarRating count={5} size={15} value={totalRatingAvg}/>
        </div>
        <div className="col-9 mt-3">
          <div className="row" style={{textAlign:'left'}}>
            <span className="offset-1 col-3 mb-3">맛</span>
              {ratings&& <ProgressBar rate={ratings.taste?ratings.taste:0}></ProgressBar>}
          </div>
          <div className="row" style={{textAlign:'left'}}>
            <span style={{display:"inline-block", whiteSpace:'nowrap'}} className="offset-1 col-3 mb-3">분위기</span>
            {ratings&&<ProgressBar rate={ratings.atmosphere?ratings.atmosphere:0}></ProgressBar>}
          </div>
          <div className="row" style={{textAlign:'left'}}>
            <span className="offset-1 col-3 mb-3">가격</span>
            {ratings&&<ProgressBar rate={ratings.price?ratings.price:0}></ProgressBar>}
          </div>
        </div>
      </Container>
    </div>
  )
}

function PageTwoSectionTwo(probs){
  const [data, setData] = useState(null);
  const [deleteCnt, setDeleteCnt] = useState(0);
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://yammycafe.fly.dev/cafe/api/${id}`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [deleteCnt, probs.isCommentUpdated]);

  const connectedUserId = probs.user.user ? probs.user.user._id : null;
  
  async function submitForm(data) {
    const url = window.location.pathname;
    const id = url.substring(url.lastIndexOf('/') + 1);
    await axios.delete(`https://yammycafe.fly.dev/cafe/user/review/${id}`,{
      data:{
        commentID: data
      } 
    })
      .then((res) => {
        setDeleteCnt(deleteCnt+1);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  const handleSubmit = (commentID) =>(e)=>{
    e.preventDefault();
    probs.setCommentUpdated({...{state:true}});
    submitForm(commentID)
  }
  const reviews = [];

  console.log("데이터 데이터", data);
  if(data != null){
    for(let comment of data.comment){
      console.log("코맨트 코맨트", comment);
      const rating = comment.rating;
      const ratingAvg = ((rating.price + rating.taste + rating.atmosphere)/3).toFixed(2);
      const img = comment.image && <img
                  className="d-block"
                  src={comment.image}
                  style ={{objectFit :'contain', width :'100%', height :'100%'}}
                  />
      reviews.push(
      <Container className="row mt-3 pt-3 pb-3 mb-3" style={{border:`2px solid ${grayColor}`, minHeight: '5rem', width:'50vw', maxWidth: '850px', minWidth:'360px' }}>{/*2번항목*/}
        <div style = {{textAlign:'right'}}>
        <form onSubmit={handleSubmit(comment._id)}>
          {probs.isLoggedIn&&(comment.user._id===connectedUserId)&&<button type="submit" class="btn btn-outline-secondary btn-sm">삭제</button>}
          </form>
        </div>
        <div className="col-3 d-flex justify-content-center flex-column align-items-center" style={{minWidth:'110px'}}>
          <StarRating count={5} size={15} value={ratingAvg}></StarRating>
            <div className="ml-3 mb-2" style = {{textAlign:'left', marginLeft:'0.5rem'}}>{comment.user.nickName}</div>
              <div style={{maxWidth:"100px", maxHeight:"100px", textAlign:"center"}}>
                {img}
              </div>
            </div>
          <div className="offset-lg-1 col-8 ml-3" style={{borderLeft:`2px solid ${grayColor}`}}>
            <div style={{textAlign:'left'}}>
              <div style={{textSize:'1em', color:'white', textAlign:'center', display:'inline-block', backgroundColor:'#219ebc', padding:'0 1rem 0 1rem', borderRadius:'1rem', marginTop:'0.5rem'}}>
              {comment.purpose}
              </div>
            </div>
          <div className='text-start'>{comment.content}</div>
        </div>
    </Container>
    );
  }}

  return(
    <div className="d-flex justify-content-center row">
      {reviews}
    </div>
  )
}

function PageTwoSectionThree(probs) {
  const [modalVisible, setModalVisible] = useState(false);
  const [formState, setFormState] = useState('');
  const [tasteRate, setTasteRate] = useState(5);
  const [atmosRate, setAtmosRate] = useState(5);
  const [priceRate, setPriceRate] = useState(5);
  const [study, setStudy] = useState(false);
  const [talk, setTalk] = useState(false);
  const [takeOut, setTakeOut] = useState(false);
  const [noFeature, setNoFeature] = useState(false);
  const [imgFile, setImgFile] = useState({});

  console.log(tasteRate, atmosRate, priceRate);

  const hanldeTasteRate = (evt)=>{
    setTasteRate(evt.target.value);
  }
  const hanldeAtmosRate = (evt)=>{
    setAtmosRate(evt.target.value);
  }
  const hanldePriceRate = (evt)=>{
    setPriceRate(evt.target.value);
  }
  
  const userID = probs.user.user._id;
  console.log('사용자', probs.user);

  async function submitForm(data) {
    const url = window.location.pathname;
    const id = url.substring(url.lastIndexOf('/') + 1);

    console.log('데이터', data);
    await axios.post(`https://yammycafe.fly.dev/cafe/user/review/${id}`, data)
      .then((res) => {
        setFormState('');
        console.log(data);
        console.log(res);
        probs.setCommentUpdated({...{state:true}});
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('comment', formState);
    formData.append('userID', userID);
    formData.append('tasteRate', tasteRate);
    formData.append('atmosRate', atmosRate);
    formData.append('priceRate', priceRate);
    formData.append('study', study);
    formData.append('talk', talk);
    formData.append('takeOut', takeOut);
    formData.append('noFeature', noFeature);
    formData.append('photos', imgFile);

    submitForm(formData);
    probs.setParentData({...{comment: formState} });
    handleCloseModal();
  };

  const handleInputChange = (event) => {
    let commentLength = event.target.value;
    if(commentLength.length <= 135)
      setFormState(event.target.value);
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handelStudy = (evt) =>{
    setStudy(true);
    setTalk(false);
    setNoFeature(false);
    setTakeOut(false);
  }

  const handelTalk = (evt) =>{
    setTalk(true);
    setNoFeature(false);
    setStudy(false);
    setTakeOut(false);
  }

  const handelTakeOut = (evt) =>{
    setTakeOut(true);
    setTalk(false);
    setNoFeature(false);
    setStudy(false);
  }
  const handelNoFeature = (evt) =>{
    setNoFeature(true);
    setStudy(false);
    setTalk(false);
    setTakeOut(false);
  }
  
  const handleFileUpload = (event) =>{
    const uploadedFile = event.target.files[0];
    setImgFile(uploadedFile);
  }

  return (
    <div className="mb-3">
      <button onClick={handleButtonClick} className="btn btn-primary">리뷰작성</button>
      {modalVisible && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">리뷰 작성</h5>
                <button type="button" className="close" onClick={handleCloseModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="d-flex flex-column" enctype="multipart/form-data">
                      <div className="modal-body d-flex flex-column mt-3">
                          <div className='offset-1 col-8 mb-3' style={{textAlign:'center'}}>
                            <div>
                              <div>맛</div>
                              <input type='range' min="1" max="5" step="1" style={{width:'12rem'}} value={tasteRate} onChange={hanldeTasteRate}></input>
                            </div>
                            <div>
                              <div>분위기</div>
                              <input type='range' min="1" max="5" step="1" style={{width:'12rem'}} value={atmosRate} onChange={hanldeAtmosRate}></input>
                            </div>
                            <div>
                              <div>가격</div>
                              <input type='range' min="1" max="5" step="1" style={{width:'12rem'}} value={priceRate} onChange={hanldePriceRate}></input>
                            </div>
                        </div>
                        <div className="text-center">
                          <h5>분위기</h5>
                          <div className="form-check  form-check-inline">
                            <input className="form-check-input" type="radio"  name="flexRadioDefault" value={study} onChange={handelStudy}/>
                            <label className="form-check-label" for="exampleRadios1">
                              공부
                            </label>
                          </div>
                          <div className="form-check  form-check-inline">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" value={talk} onChange={handelTalk} />
                            <label className="form-check-label" for="exampleRadios2">
                              수다
                            </label>
                          </div>
                          <div className="form-check  form-check-inline">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" value={takeOut} onChange={handelTakeOut} />
                            <label className="form-check-label" for="exampleRadios2">
                              테이크아웃
                            </label>
                          </div>
                          <div className="form-check  form-check-inline">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" value={noFeature} onChange={handelNoFeature} />
                            <label className="form-check-label" for="exampleRadios2">
                              기타
                            </label>
                          </div>
                        </div>
                          <textarea style={{ minHeight: '5rem', minWidth: '20rem' }} name='cafe[comment]' value={formState} onChange={handleInputChange} />
                          <div class="input-group mb-3 mt-3">
                            <input type="file" class="form-control" id="inputGroupFile02"  onChange={handleFileUpload}/>
                            <label class="input-group-text" for="inputGroupFile02">사진</label>
                          </div>
                      </div>
                      <div className="modal-footer justify-content-around">
                        <button type="submit" className="btn btn-success">완료</button>
                        <button className="btn btn-secondary" onClick={handleCloseModal}>닫기</button>
                      </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PageTwo(probs){
  const [lastComment, setData] = useState(null);
  const [isCommentUpdated, setCommentUpdated] = useState(null);

  console.log('라스트', lastComment);
  return(
    <div>
      <PageTwoSectionOne isCommentUpdated = {isCommentUpdated} />
      <PageTwoSectionTwo isCommentUpdated={isCommentUpdated} setCommentUpdated = {setCommentUpdated} parentData  = {lastComment} isLoggedIn = {probs.isLoggedIn} user = {probs.user}/>
      {probs.isLoggedIn?<PageTwoSectionThree setCommentUpdated = {setCommentUpdated} setParentData = {setData} user = {probs.user}/>:<div></div>}
    </div>
  )
}

function PageThree(props){
  console.log("페이지 3", props.repreMenus);

  const repreMenuArr = [];
  for(let repre of props.repreMenus){
    repreMenuArr.push(
      <div className='row border-bottom mb-3'>
        <div className="col-4">
          <div className="mb-3" style={{fontWeight:'bold', textAlign:'start'}}>{repre.name}</div>
          <div style={{textAlign:'start', marginLeft:'0.2em'}}>{repre.price.toLocaleString()}원</div>
        </div>
        <div className='col-5'>
          <div style={{textAlign:'start'}}>
            {repre.description}
          </div>
        </div>
        <div className='col-3'>
          <img
                className="d-block w-100 mb-2"
                src={repre.imgUrl}
                style ={{objectFit :'contain', width :'100%', height :'100%'}}
                />
        </div>
      </div>
    );
  }

  const menuArr = [];
  for(let menu of props.menus){
    let image = menu.imgUrl&&<img
        className="d-block w-100 mb-2"
        src={menu.imgUrl}
        style ={{objectFit :'contain', width :'100%', height :'100%'}}
      />
    menuArr.push(
      <div className='row border-bottom mb-3 p-3'>
        <div className="col-4">
          <div className="mb-3" style={{fontWeight:'bold', textAlign:'start'}}>{menu.name}</div>
          <div style={{textAlign:'start', marginLeft:'0.2em'}}>{menu.price.toLocaleString()}원</div>
        </div>
        <div className='col-5'>
          <div style={{textAlign:'start'}}>
            {menu.description}
          </div>
        </div>
        <div className='col-3'>
        {image}
        </div>
      </div>
    )
  }

  function RepreMenu(){
    if(repreMenuArr){
      return(
        <div style={{border:'3px ridge #edede9', padding:'1em', marginBottom:'1em', borderRadius:'15px'}}>
          <h3 style={{marginBottom:'1.5em',  color:'#000814'}}>***대표 메뉴***</h3>
          {repreMenuArr}
        </div>
      )
    }
    else{
      return(
        <div>ss</div>
      )
    }
  }

  function Menu(){
    if(menuArr){
      return(
        <div>
          <h4 style={{textAlign:'start', paddingLeft:'15px', padding:'15px', marginLeft:'0.3em',  marginRight:'0.3em', marginBottom:'15px',border:`1px ${grayColor} solid;`, backgroundColor:'#edede9'}}>
            메뉴
          </h4>
          {menuArr}
        </div>
      )
    }
    else{
      <div></div>
    }
  }

  return(
    <div style={{ maxWidth: '650px',  width:'100%',minWidth:'8em' }}>
      <RepreMenu/>
      <Menu/>
    </div>
  )
}

function SetPage(probs) {
  const [cafeData, setCafeData] = useState(null);
  const [pageNumber, setPage] = useState(0);
  const [menus, setMenus] = useState(null);
  const [repreMenus, setRepreMenus] = useState(null);

  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);
  useEffect(() => {
    const fetchData = async () => {
      try {//https://yammycafe.fly.dev/
        const response = await axios.get(`https://yammycafe.fly.dev/cafe/api/${id}`);
        setCafeData(response.data);
        setMenus(response.data.menu);
        setRepreMenus(response.data.repreMenu);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  console.log('받아온 카페 데이터', cafeData);

  let content = null;
  switch(pageNumber){
    case 0:
      content = <PageOne isLoggedIn={probs.isLoggedIn} user ={probs.user} id={id} setCafeData={setCafeData} cafeData={cafeData}></PageOne>
      break;
    case 1:
      content = <PageTwo isLoggedIn={probs.isLoggedIn} user={probs.user}></PageTwo>
      break;
    case 2:
      content = <PageThree repreMenus = {repreMenus} menus={menus}></PageThree>
      break;
}

  const authorId = cafeData&&cafeData.author._id;
  const currentUserId = probs.user.isLoggedIn&&probs.user.user._id;

  const handlEditeButton = async() => {
    const url = window .location .pathname ;
    const id = url .substring (url .lastIndexOf ('/') + 1 );
    window.location.href = `https://yammycafe.fly.dev/cafe/edit/${id}`;
  }

  const handleDeleteButton = async ()=>{
    const url = window .location .pathname ;
    const id = url .substring (url .lastIndexOf ('/') + 1 );
    await axios.delete(`https://yammycafe.fly.dev/cafe/${id}`)
      .then((res)=>{
        window.location.replace("https://yammycafe.fly.dev/cafe");
      })
      .catch((err)=>{
        console.log("Error : ", err);
      })
  }

  const editButton = authorId === currentUserId?
  <button style={{maxWidth:'500px'}}onClick={handlEditeButton} type="button" class="btn btn-primary mb-3">수정</button>:
  <div></div>
  
  const deleteButton = authorId === currentUserId?
        <button style={{maxWidth:'500px'}}onClick={handleDeleteButton} type="button" class="btn btn-danger mb-3">카페 삭제</button>:
        <div></div>


  
  return (
  <div>
      <button className='topButton btn1' onClick={() => setPage(0)}>
        요약
      </button>
      <button className='topButton btn2' onClick={() => setPage(1)}>
        후기
      </button>
      <button className='topButton btn3' onClick={() => setPage(2)}>
        메뉴
      </button>
      <div className="d-flex flex-column justify-content-center align-items-center" style={{margin:'0'}}>
        {content}
        {editButton}
        {deleteButton}
        <details style={{textAlign:'center', marginBottom:'5em', minWidth:'20em', width:'100%'}}>
          <summary>지도 보기</summary>
          <KakaoMap latitude={cafeData&&cafeData.latitude} longitude={cafeData&&cafeData.longitude}></KakaoMap>
        </details>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    axios.get(`https://yammycafe.fly.dev/user/api/islogIn`)
      .then((res) => {
        const data = res.data;
        setIsLoggedIn(!!(data.isLoggedIn));
        setUserData(data);
      });
  }, []);

  let containerColor;
  let backImg;
  if (window.location.pathname === '/') {
    backImg = '/media/coffeeBean.jpg'
  } else {
    containerColor = 'white';
    backImg = '/media/coffeeBean.jpg'
  }

  console.log('유저 데이터', userData)
  return (
    <div className="App" style={{backgroundColor:'white', backgroundImage:`url(${backImg})`, paddingBottom:'7em'}}>
      <NavBar isLoggedIn={isLoggedIn}></NavBar>
      <Container className="allPageContainer d-flex justify-content-center mb-3">
        <Router className="wrapper3D d-flex justify-content-center">
          <Routes>
            <Route path="/cafe/:id" element={<SetPage isLoggedIn={isLoggedIn} user={userData} />} />
            <Route path="/" element={<Home/>} />
          </Routes>
        </Router>
      </Container>
    </div>
  );
}

export default App;

