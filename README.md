<h1>카페바라</h1>
<h2>프로젝트 설명</h2>
<ul>
  <li>카페 항목을 모아보는 서비스를 제공하는 Node.js 기반 개인 프로젝트</li>
  <li>몽고DB의 regex를 사용한 검색 기능을 제공한다. 몽고DB의 검색 값을 자바스크립트로 처리한 필터링 결과를 제공한다.</li>
  <li>passport local 기반 로그인 및 회원가입을 제공한다.</li>
  <li>카카오맵 기반 실제 존재하는 카페 항목 생성 및 위치 기반 서비스를 제공한다.</li>
  <li>카페 찜 기능을 제공한다.</li>
  <li>cloidinary 기반 사진 업로드 가능한 댓글 기능을 제공한다.</li>
  <li>내 활동을 확인 가능한 "내 정보" 페이지를 제공한다.</li>
  <li>MVC패턴을 적용한다. 서버사이드는 express를 이용, 클라이언트 사이드는 React와 ejs 템플릿 엔진을 혼용한다.</li>
  </ul>
<a href="https://yammycafe.fly.dev/">카페바라</a>
</hr>
<h2>기술 스택</h2>
<ul>
  <li>Node.js - js런타임 환경</li>
  <li>express - js기반 서버 프레임워크</li>
  <li>MongoDB - NoSQL 데이터베이스</li>
  <li>React - 클라이언트 사이드 프레임워크</li>
  <li>Bootstrap, Bootstrap-react - CSS 프레임워크</li>
</ul>
<h2>사용 API</h2>
<ul>
  <li>cloudinary - 사진 저장 및 관련 api 제공 Sass 클라우드</li>
  <li>Kakaomap API - 카카오 지도, 마커 생성, 위치 기반 검색 등의 기능 제공</li>
  <li> kakao 공유 API - 카카오 공유 기능 제공</li>
</ul>
<h2>배포</h2>
<ul>
  <li>fly.io - 도커이미지 기반 어플리케이션 배포 플랫폼</li>
  <li>mongoDB Atlas - 몽고DB 클라우드 서비스 </li>
 </ul>
 </hr>
 <h2>프로젝트로 배운 점</h2>
 <ul>
  <li>한층 복잡한 몽고DB쿼리의 사용 및 스키마 설계에 대해 고민하였습니다.</li>
  <li>DOM구조와 버츄얼DOM의 동작 방식에 대해 고민하고 필요에의해 프로젝트에 React를 도입하였습니다.</li>
  <li>CORS등 통신관련 제약 및 해결을 진행하였습니다.</li>
  <li>도커 이미지, 몽고DB 집계, Passport와 OAuth, 클라우드 서비스 등에 대한 깊은 공부가 필요함을 알았습니다.</li>
   <li>실질적 코딩 외의 설계, 디자인 패턴, 디자인 등에 대한 깊이 고민하였습니다. 유지보수성을 올리기 위해 이와 관련된 툴의 필요성을 알았습니다.</li>
  <li>항상 같은 문제를 마주함을 깨닫고 트러블 슈팅을 작성하였습니다.</li>
 </li>
<h2>개선 고려할 사항</h2>
<ul>
 <li>
  회원 제약 - 보안을 강화시키고 유저의 실질적 정보(휴대폰 번호, 이메일 등)을 저장하도록 처리. 비밀번호에 특수 문자 및 다양한 알파벳 조합만 가능하도록 구현</ul>
 </li>
 <li>
  게시판 기능 - 유저끼리 소통 가능한 게시판 기능을 제공
  </li>
 <li>
  오늘의 카페 - 클릭율 기반으로 한 가장 관심도 높은 카페 순위를 보여줌
 </li>
 <li>
  비즈니스 모델 및 사용자 유치 - 사용자를 유치할 방법을 강구하고 비즈니스 모델을 설립하여야함.
  </li>
  <li>
   크롤링 기반 이미지 - 크롤링을 기반으로한 해당 카페의 이미지 및 정보를 한 페이지에서 보여주도록 구현
  </li>
  <li>
    무한 스크롤 - 카페 항목의 생성이 많을 경우 무한 스크롤 도입 고려
  </li>
 </ul>
   
