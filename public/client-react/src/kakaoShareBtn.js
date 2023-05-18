import React, { useEffect, useState } from 'react'

export function KakaoShareBtn() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        document.body.appendChild(script);
      });

    const handleKakaoShare =()=>{
        window.Kakao.init('36ae5291fff272f636c29f53ee0e5ad5');
        window.Kakao.Share.createDefaultButton({
            container: '#kakaotalk-sharing-btn',
            objectType: 'text',
            text:
              '이 카페 어때요?',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          });
    }

  return (
    <button className = "shareBtn" id = "kakaotalk-sharing-btn" onClick={handleKakaoShare}>
        <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오톡 공유 보내기 버튼" />
    </button>
  )
}