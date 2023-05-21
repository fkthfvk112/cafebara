export function NavBar({isLoggedIn}){
    console.log("나브바", isLoggedIn);
    const logInOrOut = isLoggedIn?
        <a class="nav-link me-3" href="/user/logout"  style={{color:'#0000008C'}}>로그아웃</a>
        :
        <a class="nav-link" href="/user/signin"  style={{color:'#0000008C'}}>로그인</a>;

    return(
        <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark" style={{top:'0px', width:'100%', zIndex: '2'}} sticky>
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Cafebara</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/cafe">카페 목록</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/cafe/create">카페 등록</a>
                    </li>
                </ul>
                <span class="nav-item">
                    <a class="nav-link me-3" href="/user" style={{color:'#F8F9FAA6'}}>내 정보</a>
                </span>
                <span class="nav-item me-2">
                    {logInOrOut}
                </span>
                </div>
            </div>
        </nav>
    )
}
