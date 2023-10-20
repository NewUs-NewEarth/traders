/**
 * @author hyunseul
 * @create date 2023-10-17 16:30:56
 * @modify date 2023-10-19 21:56:07
 */
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/MainTop.css'
import logo from "../../assets/img/logo.gif";

const MainTop = () => {
    return (
        <div className='main'>
          <div className='container'>
            <img src={logo} className='logo-img'></img> 
            <div className='text'>
             <p className='text1'> Find exciting goods</p>
             <p className='text2'>Swap things for quality products that suit you </p>
        </div>
            <nav className="container-fluid">
                <form className="d-flex">
                <input className="searchBar form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="search-btn btn btn-outline-success" type="submit">Search</button>
                </form>
            </nav>
            
          
           </div>
        </div>
    );
};

export default MainTop;