<<<<<<< Updated upstream
import React, { useRef,useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> Stashed changes
import { Link, Route, Switch } from "react-router-dom";
import GreenPay from "./components/payment/GreenPay";
import PayRegister from "./components/payment/PayRegister";
import ProductDetails from "./components/product/ProductDetails";
import ProductListHeader from "./components/product/ProductListHeader";
import ProductRegistration from "./components/product/ProductRegistration";

import ChatApp from "./components/chat/ChatApp";
import ChatBox from "./components/chat/ChatBox";
import ChatList from "./components/chat/ChatList";
import MainTop from "./components/layout/MainTop";
import ModalPage from "./components/product/Location";
import SignUp from "./components/service/SignUp";
import CampaignDatails from "./components/sns/CampaignDatails";
import CampaignList from "./components/sns/CampaignList";
import NewsList from "./components/sns/NewsList";
import Youtube from "./components/sns/Youtube";
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes

import { ThemeProvider } from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import AccountRegister from "./components/payment/AccountRegister";
import ProductUpdate from "./components/product/ProductUpdate";
import Login from "./components/service/Login";
import { signout } from "./components/service/SignAPIService";
<<<<<<< Updated upstream
import { Button } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import TokenRefresher from "./components/service/TokenRefresher";
import AccountRegister from "./components/payment/AccountRegister";
import "./styles/global.css";
import { createTheme, ThemeProvider  } from "@material-ui/core/styles";


import MainFooter from "./components/layout/MainFooter";
import ResizedComponent from "./components/layout/ResizedComponent";
import NavBar from "./components/layout/NavBar";
import MainView from "./components/layout/MainView";

const theme = createTheme({
  typography: {
    fontFamily: 'NanumSquareNeo',
  }
});

function App() {
  return (
    <>
      <ResizedComponent>
      <NavBar/>
        <MainView/>
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

=======
import "./styles/global.css";

function App() {
  if (localStorage.getItem("REFRESH_TOKEN")) {
    const userInfo = jwt_decode(localStorage.getItem("REFRESH_TOKEN"));
    window.user = userInfo.sub;
    console.log("app.js", window.user);
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
            <Link to="/products">ProductList</Link>
          </li>
          <li>
            <Link to="/KakaoMap">KakaoMap</Link>
          </li>

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        
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
              {/* <MainView /> */}
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
            <Youtube />
            <NewsList />
          </Route>

          <Route path="/campaign" exact>
            <CampaignList />
          </Route>
          <Route path="/campaign/:id" exact>
            <CampaignDatails />
          </Route>

          <Route path="/sns" exact></Route>
        </Switch>
        
      
    
        </div>

        <ChatList/>
        <MainFooter/>
   
        
      </ThemeProvider>
      </ResizedComponent>
</>
=======
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
            {/* <MainView /> */}
            <MainTop />
          </Route>
          <Route path="/products" exact>
            <ProductListHeader />
          </Route>
          <Route path="/products/register" exact>
            <ProductRegistration />
          </Route>
          <Route path="/products/:id" exact>
            <ProductDetails />
          </Route>
          <Route path="/products/update/:id" exact>
            <ProductUpdate />
          </Route>

          <Route path="/login" exact>
            <Login />
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

          <Route
            path="/chat/roomNum/:roomNum"
            component={ChatBox}
            exact
          ></Route>
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

        <ChatList />
      </div>
    </>
>>>>>>> Stashed changes
  );
}

export default App;
