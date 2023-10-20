/**
 * @author hyunseul
 * @create date 2023-10-17 16:30:56
 * @modify date 2023-10-19 21:56:53
 */
import React from 'react';
import MainCarousel from './MainCarousel';
import  ResizedComponent  from './ResizedComponent';
import MainNews from './MainNews';
import MainImg from './MainImg';



const MainView = () => {
    return (
        <>
        <ResizedComponent>
            <MainCarousel/>
            <MainImg/>
            <MainNews/>
        </ResizedComponent>
        </>       
        
    );
};

export default MainView;