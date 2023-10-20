import React from 'react';
import main1 from  '../../assets/img/main1.png';

import MainMobileMap from '../../assets/img/MainMobileMap.png';
import '../../assets/css/MainTop.css'


const MainImg = () => {

    return (
        <div className='main' style={{backgroundColor:'#fff'}}>
          <div className='container'>
            <div>
                <img src={main1} className='main-img' ></img>
                <p className='main-img-text-4'>친환경 소비생활　<font style={{backgroundColor:"#167952",color:'#fff'}}>MZ세대 소비생활</font></p>
                <p className='main-img-text-2'>"사기는 NO! 똑똑하게 물건 사는 방법!</p>
                <p className='main-img-text-1'>슬기로운 중고거래</p>
                <p className='main-img-text-3'>중고거래가 하나의 문화가 되면서 쓰레기가 감소하는 긍정적인 효과</p>
                
            </div>
           </div>
            
        </div>
    );
};

export default MainImg;