import React, { useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Main from "./components/Main";
import GreenPay from "./components/payment/GreenPay";
import PayRegister from "./components/payment/PayRegister";
import NearestProductList from "./components/product/NearestProductList";
import ProductDetails from "./components/product/ProductDetails";
import ProductList from "./components/product/ProductList";
import ProductRegistration from "./components/product/ProductRegistration";

import ChatApp from "./components/chat/ChatApp";
import ChatBox from "./components/chat/ChatBox";
import ChatList from "./components/chat/ChatList";
import SignUp from "./components/login/SignUp";
import ModalPage from "./components/product/ModalPage";
import CampaignDatails from "./components/sns/CampaignDatails";
import CampaignList from "./components/sns/CampaignList";
import NewsList from "./components/sns/NewsList";
import Youtube from "./components/sns/Youtube";
import MainView from "./components/layout/MainView";

import './index.css';
import { ThemeProvider, createTheme } from "@material-ui/core";
import Login from "./components/service/Login";
import { signout } from "./components/service/DemoAPIService";
import { Button } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import TokenRefresher from "./components/service/TokenRefresher";
import AccountRegister from "./components/payment/AccountRegister";

const theme = createTheme({
  typography: {
    fontFamily: "Pretendard-Regular"
  }
})

function App() {
  
  return (

  <ThemeProvider theme={theme}>
    <ToastContainer/>
    {/* <TokenRefresher/> */}
    <div className="Pretendard-Regular">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products/register">ProductRegistration</Link>
        </li>
        <li>
          <Link to="/products/nearestProducts">NearestProductList</Link>
        </li>
        <li>
          <Link to="/products">ProductList</Link>
        </li>
        <li>
          <Link to="/KakaoMap">KakaoMap</Link>
        </li>

        <hr />
        <li>
          <Link to="/login">로그인테스트</Link>
          <br />
        </li>
        <li>
          <Link to="/signup">회원가입테스트</Link>
          <br />
        </li>
        <li>
          <Link to="/payment">GreenPay</Link>
        </li>
        <br />

        <li>
          <Link to="/payment">GreenPay</Link>
        </li>
        <li>
          <Link to="/chat">chat</Link>
        </li>

        <button onClick={signout}>로그아웃</button>
        <hr />

        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/campaign">Campaign</Link>
        </li>
        <li>
          <Link to="/sns">sns</Link>
        </li>
      </ul>
        
     

      <Switch>

        <Route path={["/", "/main"]} exact>
          <MainView />
        </Route>
        <Route path="/products" exact>
          <ProductList />
        </Route>
        <Route path="/products/nearestProducts" exact>
          <NearestProductList />
        </Route>
        <Route path="/products/register" exact>
          <ProductRegistration />
        </Route>

        <Route path="/products/:id" exact>
          <ProductDetails />
        </Route>

        <Route path="/login" exact>
          <Login/>
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>

        <Route path="/KakaoMap" exact>
          <ModalPage />
        </Route> 
        <Route path="/payment" exact>
          <GreenPay />
        </Route>

        <Route path="/payment/gpay_register" component={PayRegister} />
        <Route path="/payment/accnt_register" component={AccountRegister} />

        <Route path="/chat" exact>
          <ChatApp />
        </Route>

        <Route path="/chat/roomNum/:roomNum" component={ChatBox} exact></Route>
        <Route path="/chat/list" component={ChatList} exact></Route>

        <Route path="/news" exact>
          <NewsList />
          <Youtube />
        </Route>

        <Route path="/campaign" exact>
          <CampaignList />
        </Route>
        <Route path="/campaign/:id" exact>
          <CampaignDatails />
        </Route>

        <Route path="/sns" exact></Route>
      </Switch>
     
        <ChatList/>
       <MainView/>
    </div>

    </ThemeProvider>
  );
}

export default App;