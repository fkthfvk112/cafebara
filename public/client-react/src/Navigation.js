import { Button, Container, Nav, Navbar } from 'react-bootstrap';

export function NavBar({ isLoggedIn }) {
  console.log("나브바", isLoggedIn);
  const logInOrOut = isLoggedIn ?<Nav.Link className="me-3" href="/user/logout" style={{ color: '#F8F9FAA6' }}>로그아웃</Nav.Link>:<Nav.Link className="me-3" href="/user/signin" style={{ color: '#F8F9FAA6' }}>로그인</Nav.Link>;

  return (
    <Navbar className="navbar navbar-expand-lg bg-body-tertiary d-flex justify-content-center" data-bs-theme="light" style={{top: '0px', width: '100%', zIndex: '2' }} sticky expand="lg">
      <Container style={{margin:'0'}}>
        <Navbar.Brand style={{color:"white"}} href="/">Cafebara</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent"/>
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto">
            <Nav.Link style={{color:"white"}} href="/" active>Home</Nav.Link>
            <Nav.Link style={{color:"#F8F9FAA6"}} href="/cafe">카페 목록</Nav.Link>
            <Nav.Link style={{color:"#F8F9FAA6"}} href="/cafe/create">카페 등록</Nav.Link>
          </Nav>
          <Nav >
            <Nav.Link href="/user" className="me-3" style={{ color: "#F8F9FAA6" }}>내 정보</Nav.Link>
            {logInOrOut}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
