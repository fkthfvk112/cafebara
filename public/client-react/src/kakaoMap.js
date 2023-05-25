import React, { useEffect, useState } from 'react'
const KAKAOMAP_KEY = process.env.REACT_APP_KAKAOMAP_KEY;

export function KakaoMap(probs) {

    useEffect(()=>{
        const script = document.createElement('script');
        script.async = true;
        script.src= `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`;
        document.head.appendChild(script);
            script.addEventListener("load", ()=>{
                if(probs.latitude != null && probs.longitude != null)
                    window.kakao.maps.load(()=>{
                        const container = document.getElementById('map');
                        const options = {
                            center: new window.kakao.maps.LatLng(probs.latitude, probs.longitude),
                            level: 3,
                            draggable: true
                        };
                        let map =new window.kakao.maps.Map(container, options);
                        let marker = new window.kakao.maps.Marker({
                            position: new window.kakao.maps.LatLng(probs.latitude, probs.longitude)
                        });                        
                        marker.setMap(map)
                    });
                });
    }, [probs.latitude, probs.longitude])


  return (
    <div id="map" style={{width:'100%', height:'400px'}}>

    </div>
  )
}