import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

import React, { useState, useEffect } from 'react';
const grayColor = '#dad7cd';

function FirstPageCarousel() {
  return (
    <Carousel slide={false}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://cdn.pixabay.com/photo/2023/01/12/05/32/duck-7713310_640.jpg"
          alt="First slide"
          style={{width: '50%'}}
        />

      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://cdn.pixabay.com/photo/2023/01/12/05/32/duck-7713310_640.jpg"
          alt="Second slide"
          style={{width: '50%'}}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://cdn.pixabay.com/photo/2023/01/12/05/32/duck-7713310_640.jpg"
          alt="Third slide"
          style={{width: '50%'}}
        />
      </Carousel.Item>
    </Carousel>
  );
}

function PageOne(){
  
  return(
    <div>
      <FirstPageCarousel className="row pt-3 pb-3" style={{width: '50%'}}/>{/*1번항목*/}
      <div className="row mt-3 pt-3 pb-3" style={{borderTop:`2px solid ${grayColor}`}}>{/*2번항목*/}
        <div className="col-4">
          <span>3.8</span>{/*평점*/}
          <span>적당함</span>
        </div>
        <div className="col-8">
          <div className="row">{/*댓글*/}
            <span>댓글</span>
          </div>
          <div className="row">{/*댓글*/}
            <span>댓글</span>
          </div>
          <div className="row">{/*댓글*/}
            <span>댓글</span>
          </div>
        </div>
      </div>
      <div className='row pt-3 pb-3 text-center' style={{borderTop:`2px solid ${grayColor}`}}>{/*3번항목*/}
        <span>지도</span>
      </div>
    </div>
  )
}

function PageTwoSectionOne(){
  return(
    <div>
      <Container className="row mt-3 pt-3 pb-3 mb-3 text-center" style={{border:`2px solid ${grayColor}`, minHeight: '5rem', width: '30rem' }}>{/*2번항목*/}
        <div className="col-3">
          <span>평점</span>
        </div>
        <div className="col-9 ">
          <div className="row"><span>맛ㅁㅁㅁㅁㅁㅁㅁㅁㅁ</span></div>
          <div className="row"><span>분위기ㅁㅁㅁㅁㅁㅁㅁㅁㅁ</span></div>
          <div className="row"><span>가격ㅁㅁㅁㅁㅁㅁㅁㅁㅁ</span></div>
        </div>
      </Container>
    </div>
  )
}

function PageTwoSectionTwo(probs){

  const [data, setData] = useState(null);
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);
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
  }, probs.lastComment);


  const reviews = [];

  if(data != null){
    for(let comment of data.comment){
    reviews.push(
      <Container className="row mt-3 pt-3 pb-3 mb-3 " style={{border:`2px solid ${grayColor}`, minHeight: '5rem', width: '30rem' }}>{/*2번항목*/}
      <div className="col-3">
      <img
        className="d-block w-100"
        src="https://cdn.pixabay.com/photo/2023/01/12/05/32/duck-7713310_640.jpg"/>
      </div>
      <div className="col-9 ml-3" style={{borderLeft:`2px solid ${grayColor}`}}>
        <div>{comment.content}</div>
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

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm({ comment: formState });
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

  
  const handleAttachPhoto = (event) => {
    event.preventDefault();
    // 사진 첨부 기능 구현
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
              <form onSubmit={handleSubmit} className="d-flex flex-column">
                      <div className="modal-body d-flex flex-column mt-3">
                          <textarea style={{ minHeight: '5rem', minWidth: '20rem' }} name='cafe[comment]' value={formState} onChange={handleInputChange} />
                          <button onClick={handleAttachPhoto}>사진 첨부</button>
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

async function submitForm(data) {
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf('/') + 1);
  await axios.post(`http://localhost:8080/cafe/user/review/create/${id}`, data)
    .then((res) => {
      console.log(data)
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}


function PageTwo(){
  const [lastComment, setData] = useState(null);
  console.log('부모', lastComment);
  return(
    <div>
      <PageTwoSectionOne/>
      <PageTwoSectionTwo parentData  = {lastComment}/>
      <PageTwoSectionThree setParentData = {setData}/>
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
  const [pageNumber, setPage] = useState(0);
  let content = null;

  switch(pageNumber){
    case 0:
      content = <PageOne></PageOne>
      break;
    case 1:
      content = <PageTwo></PageTwo>
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
      </BrowserRouter>
    </div>
  );
}

function App() {
  
  return (
    <div className="App">
      <Container className="d-flex justify-content-center" style={{border:`1px solid ${grayColor}`, marginTop:'10%'}}>
        <SetPage></SetPage>
      </Container>
    </div>
  );
}

export default App;
