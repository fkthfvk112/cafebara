import React, { useEffect, useState } from 'react'
export function KakaoMap(probs) {
    useEffect(()=>{
        const script = document.createElement('script');
        script.async = true;
        script.src= '//dapi.kakao.com/v2/maps/sdk.js?appkey=36ae5291fff272f636c29f53ee0e5ad5&libraries=services,clusterer&autoload=false';
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
                        window.kakao.maps.Map(container, options);
                    });
                });
    }, [probs.latitude, probs.longitude])


  return (
    <div id="map" style={{width:'100%', height:'400px'}}>

    </div>
  )
}