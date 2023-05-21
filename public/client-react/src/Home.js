import './home.css';

export function Home(){
    return(
        <div>
            <section  className="imgSection">
                <div id="logoSection">
                    <img id="logo" width="350em" height ="350em" src="/media/카페바라.png"></img>
                    <div id="logoText">
                        <h1 className="mb-3 helloText">Hello!</h1>
                        <div style={{color:"#463f3a"}}>환영합니다.</div>
                        <div style={{color:"#463f3a"}}>카페를 보여주는 카페바라입니다!</div>
                        <div style={{marginBottom: "2.8em"}}>
                            <a className="goCafe" href="/cafe">카페 보기
                                <img className="mb-1 arrow" src="/media/arrow.png" alt=""/>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <hr/>
            <section>
            <div id="logoSection">
                <h1 id="categoryName">
                    <span className="box"></span>
                    We show Cafe
                </h1>
                <div id="logoText">
                    <p> 카페바라는 유저에 의해서 관리되는 카페를 보여주는 사이트입니다.<br/><br/> 목록별로 정리된 당신의 카페를 찾아보세요!</p>
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                <img src="/media/listPageImg.png" className="showCafeImg"/>
            </div>
        </section>
        <hr/>
        <section>
            <div id="howToUseSection">
                <div id="logoSection">
                    <h3 id="categoryName">
                        <span className="circle"></span>
                        검색어로 검색
                    </h3>
                    <div id="logoText">
                        <p> 메뉴 이름, 카페 이름을 검색해보세요!</p>
                    </div>
                </div>
                <div style={{textAlign: "center"}}>
                    <img src="/media/searchImg.png" className="showCafeImg2"/>
                </div>  
                <div id="logoSection">
                    <h3 id="categoryName">
                        <span className="circle"></span>
                        분위기별 검색
                    </h3>
                    <div id="logoText">
                        <p>공부, 수다, 테이크 아웃으로 구분된 분위기를 기준으로 원하는 카페를 찾으세요</p>
                    </div>
                </div>

                <div id="logoSection">
                    <h3 id="categoryName">
                        <span className="circle"></span>
                        필터링 기능
                    </h3>
                    <div id="logoText">
                        <p>별점을 기준으로 괜찮은 카페를 찾아보세요.</p>
                        <p> 현재 위치를 기준으로 가까운 카페를 찾아보세요.</p>
                    </div>
                </div>
                <div id="logoSection">
                    <h3 id="categoryName">
                        <span className="circle"></span>
                        카페 생성 및 댓글
                    </h3>
                    <div id="logoText">
                        <p>유저에 의해 생성, 관리되는 카페</p>
                        <p>댓글 또한 누구든 달고 평가할 수 있어요. </p>
                    </div>
                </div>
                <div style={{textAlign: "center"}}>
                    <img src="/media/react.png" alt="" className="showCafeImg3"/>
                </div>
            </div>
        </section>
        </div>
    )
}