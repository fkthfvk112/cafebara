
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import {StarRating} from './starRating';
import { KakaoMap } from './kakaoMap';
import {FirstPageCarousel} from './FirstPageCarousel'
import React, { useState, useEffect } from 'react';
const grayColor = '#dad7cd';
axios.defaults.withCredentials = true;


function PageOne(probs){
  const [ratings, setRatings] = useState();
  const handleAtmos = ()=>{
    let cntStudy = 0;
    let cntTalk = 0;
    let cntElse = 0;
    try{
      for(let data of probs.cafeData.comment){
        if(data.purpose == 'study') cntStudy +=1;
        if(data.purpose == 'talk') cntTalk +=1;
        else cntElse +=1
      }
      if(cntTalk >= cntStudy && cntTalk >= cntElse){
        return 'talk';
        // setAtmos('talk');
      }
      else if(cntStudy > cntTalk && cntStudy >= cntElse){
        return 'study';
        // setAtmos('study');
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
        const response = await axios.get(`http://localhost:8080/cafe/api/totalRating/${probs.id}`);
        console.log('입력 데이터', response.data);
        setRatings(response.data);
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

  const images = probs.cafeData?probs.cafeData.images:[{url:''}];
  return(
    <div>
      <FirstPageCarousel images={images} className="row pt-3 pb-3" style={{width: '50%'}}/>{/*1번항목*/}
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
          <div style={{backgroundColor:'#219ebc', color:'white', padding:'0 1rem 0 1rem', borderRadius:'1rem', marginTop:'0.5rem'}}>
            {handleAtmos()}
          </div>
        </div>
        <div className="offset-1 col-7">
          <div className="row">{/*댓글*/}
            <span className='text-start'>{probs.cafeData?probs.cafeData.description:'No'}</span>
          </div>
        </div>
      </div>
      <div className='row pt-3 pb-3 text-center' style={{borderTop:`2px solid ${grayColor}`}}>{/*3번항목*/}
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
        const response = await axios.get(`http://localhost:8080/cafe/api/totalRating/${id}`);
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
      <div className="progress w-60 col-8" role="progressbar" aria-valuemax="5" style={{padding:'0px'}}>
      <div className="progress-bar" style={{width: percentage}}>{value}</div>
      </div>
    )
  }
  const totalRatingAvg = ratings?(((ratings.taste + ratings.atmosphere + ratings.price)/3).toFixed(2)):0;

  return(
    <div>
      <Container className="row mt-3 pt-3 pb-3 mb-3 text-center" style={{border:`2px solid ${grayColor}`, minHeight: '5rem', width: '30rem' }}>{/*2번항목*/}
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
            <span className="offset-1 col-3 mb-3">분위기</span>
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
  const [deleteToggle, setDeleteToggle] = useState(false);
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);
  useEffect(() => {
    if(deleteToggle === true) setDeleteToggle(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/cafe/api/${id}`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [probs.parentData, deleteToggle]); //data수정. 컴포넌트 재 랜더링 되도록

  const connectedUserId = probs.user.user ? probs.user.user._id : null;
  
  async function submitForm(data) {
    const url = window.location.pathname;
    const id = url.substring(url.lastIndexOf('/') + 1);
    await axios.post(`http://localhost:8080/cafe/user/review/delete/${id}`, {commentID: data})
      .then((res) => {
        setDeleteToggle(true);
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
    reviews.push(
      <Container className="row mt-3 pt-3 pb-3 mb-3" style={{border:`2px solid ${grayColor}`, minHeight: '5rem', width: '30rem' }}>{/*2번항목*/}
        <div style = {{textAlign:'right'}}>
        <form onSubmit={handleSubmit(comment._id)}>
          {probs.isLoggedIn&&(comment.user._id===connectedUserId)&&<button type="submit" class="btn btn-outline-secondary btn-sm">삭제</button>}
          </form>
        </div>
          <div className="col-3">
          <StarRating count={5} size={15} value={ratingAvg}></StarRating>
          <div className="ml-3 mb-2" style = {{textAlign:'left', marginLeft:'0.5rem'}}>{comment.user.nickName}</div>
          <div style={{paddingRight:'10px', width:"100px", height:"100px"}}>
            <img
              className="d-block w-100"
              src={comment.image}
              style ={{objectFit :'contain', width :'100%', height :'100%'}}
              />
          </div>
          </div>
          <div className="col-9 ml-3" style={{borderLeft:`2px solid ${grayColor}`}}>
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
    <div>
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
    await axios.post(`http://localhost:8080/cafe/user/review/create/${id}`, data)
      .then((res) => {
        setFormState('');
        console.log(data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    probs.setCommentUpdated({...{state:true}});

    const formData = new FormData();

    formData.append('comment', formState);
    formData.append('userID', userID);
    formData.append('tasteRate', tasteRate);
    formData.append('atmosRate', atmosRate);
    formData.append('priceRate', priceRate);
    formData.append('study', study);
    formData.append('talk', talk);
    formData.append('noFeature', noFeature);
    formData.append('photos', imgFile);

    submitForm(formData);
    probs.setParentData({...{comment: formState} });
    handleCloseModal();
  };

  const handleInputChange = (event) => {
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
  }

  const handelTalk = (evt) =>{
    setTalk(true);
    setNoFeature(false);
    setStudy(false);
  }

  const handelNoFeature = (evt) =>{
    setNoFeature(true);
    setStudy(false);
    setTalk(false);
  }
  
  const handleFileUpload = (event) =>{
    const uploadedFile = event.target.files[0];
    setImgFile(uploadedFile);
    console.log("업로드딘 파일", uploadedFile);
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
                          <div className='offset-1 col-8 mb-3' style={{textAlign:'right'}}>
                            <div>
                              <span>맛 : </span>
                              <input type='range' min="1" max="5" step="1" style={{width:'12rem'}} value={tasteRate} onChange={hanldeTasteRate}></input>
                            </div>
                            <div>
                              <span>분위기 : </span>
                              <input type='range' min="1" max="5" step="1" style={{width:'12rem'}} value={atmosRate} onChange={hanldeAtmosRate}></input>
                            </div>
                            <div>
                              <span>가격 : </span>
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
      <PageTwoSectionTwo setCommentUpdated = {setCommentUpdated} parentData  = {lastComment} isLoggedIn = {probs.isLoggedIn} user = {probs.user}/>
      {probs.isLoggedIn?<PageTwoSectionThree setCommentUpdated = {setCommentUpdated} setParentData = {setData} user = {probs.user}/>:<div></div>}
    </div>
  )
}

function PageThree(){
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/cafe/api/${id}`);
        setData(response.data);

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  let result = <li>
                <ol>{data}</ol>
                <ol>{data}</ol>
               </li>

  let menus = data && data.menu.map(menu => (
    <ol key={menu._id}>{menu.name}</ol>
  ));
  
  return(
    <div>
      {data && (
        <li>
          <ol>{data.name}</ol>
          {menus}
        </li>
      )}
    </div>
  )
}

function SetPage(probs) {
  const [cafeData, setCafeData] = useState(null);
  const [pageNumber, setPage] = useState(0);

  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/cafe/api/${id}`);
        setCafeData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  console.log('데이터', cafeData);

  let content = null;
  switch(pageNumber){
    case 0:
      content = <PageOne  id={id} setCafeData={setCafeData} cafeData={cafeData}></PageOne>
      break;
    case 1:
      content = <PageTwo isLoggedIn={probs.isLoggedIn} user={probs.user}></PageTwo>
      break;
    case 2:
      content = <PageThree></PageThree>
      break;
}

  return (
    <div>
      <button onClick={() => setPage(0)}>
        요약
      </button>
      <button onClick={() => setPage(1)}>
        후기
      </button>
      <button onClick={() => setPage(2)}>
        Click me
      </button>
      <BrowserRouter>
        <Routes>
          <Route path="/cafe/:id" element={content}></Route>
        </Routes>
        <span>
          <KakaoMap latitude={cafeData&&cafeData.latitude} longitude={cafeData&&cafeData.longitude}></KakaoMap>
        </span>
      </BrowserRouter>

    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    axios.get('http://localhost:8080/user/api/islogIn')
      .then((res) => {
        const data = res.data;
        setIsLoggedIn(!!(data.isLoggedIn));
        setUserData(data);
      });
  }, []);
  console.log('유저 데이터', userData)
  return (
    <div className="App">
      <Container className="d-flex justify-content-center" style={{border:`1px solid ${grayColor}`, marginTop:'10%'}}>
        <SetPage isLoggedIn={isLoggedIn} user={userData}></SetPage>
      </Container>
    </div>
  );
}

export default App;
