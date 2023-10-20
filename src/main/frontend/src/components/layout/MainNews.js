import React from 'react';
import main3 from '../../assets/img/main3.jpg'
import '../../assets/css/MainNews.css'
import Youtube from '../sns/Youtube';
import NewsList from '../sns/NewsList';
import Container from 'react-bootstrap/Container';

const MainNews = () => {
    return (
        <Container style={{width:'100%'}} className='middle-container'>
        <Youtube/>
        <NewsList/>
        </Container>
        // <div style={{height:'680px', width:'100%',backgroundColor:'#faeec9f7'} }>
        //     <div style={{width:'100%',position:'relative',alignContent:'center',textAlign:'center',top:'240px',zIndex:'10'}}>
        //         <p style={{fontSize:'15pt'}}>친환경 소비생활　MZ세대 소비생활</p>
        //         <p className=''>슬기로운 중고거래 </p>
        //         <p className=''>중고거래가 하나의 문화가 되면서 쓰레기가 감소하는 긍정적인 효과 </p>
        // </div>
        //         <img src={main3} style={{width:'100%',position:'relative',top:'160px', float:'center', height:'550px',alignContent:'center',margin:'auto'}}></img>

   
        //     </div>
        
    );
};

export default MainNews;