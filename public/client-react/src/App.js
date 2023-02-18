import logo from './logo.svg';
import './App.css';
import axios from 'axios';


import React, { useState, useEffect } from 'react';

function PageOne(){

  return(
    <h1>hello world</h1>
  )
}

function PageTwo(){

  return(
    <h1>bye</h1>
  )
}

function PageThree(){
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/react')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  let result = [];
  for(let cafe of data){
    console.log('카페', cafe)
    result.push(
      <li key={cafe._id}>
        <ol>{cafe.name}</ol>
        <ol>{cafe.repreMenu}</ol>
      </li>
    )
  }
  return(
    <h1>
      {result}
    </h1>
  )
}

function SetPage() {
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
        Click me
      </button>
      <button onClick={() => setPage(1)}>
        Click me
      </button>
      <button onClick={() => setPage(2)}>
        Click me
      </button>
      {content}
    </div>
  );
}

function App() {
  return (
    <div className="App">
        <SetPage></SetPage>

    </div>
  );
}

export default App;
