import React from "react";
import {Link, Route, Switch} from "react-router-dom";
import GreenPay from "./components/payment/GreenPay";
import PayRegister from "./components/payment/PayRegister";
import ProductDetails from "./components/product/ProductDetails";
import ProductRegistration from "./components/product/ProductRegistration";

import ChatApp from "./components/chat/ChatApp";
import ChatBox from "./components/chat/ChatBox";
import ChatList from "./components/chat/ChatList";
import SignUp from "./components/service/SignUp";
import ModalPage from "./components/product/ModalPage";
import CampaignList from "./components/sns/CampaignList";
import NewsList from "./components/sns/NewsList";
import Youtube from "./components/sns/Youtube";


import Login from "./components/service/Login";
import {signout} from "./components/service/SignAPIService";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AccountRegister from "./components/payment/AccountRegister";
import "./styles/global.css";
import {createTheme, ThemeProvider} from "@material-ui/core/styles";


import MainFooter from "./components/layout/MainFooter";
import ResizedComponent from "./components/layout/ResizedComponent";
import NavBar from "./components/layout/NavBar";
import MainView from "./components/layout/MainView";
import SnsRegistration from "./components/sns/SnsRegistration";
import jwt_decode from "jwt-decode";

const theme = createTheme({
    typography: {
        fontFamily: 'NanumSquareNeo',
    }
});


function App() {

    if (localStorage.getItem("REFRESH_TOKEN")) {
        const userInfo = jwt_decode(localStorage.getItem("REFRESH_TOKEN"));
        window.user = userInfo.sub;
        console.log("app.js", window.user);
    }

    return (<>
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

                            {/* :::::::::: 휘성 products 관련 :::::::::: */}
                            <li>
                                <Link to="/products/register">ProductRegistration</Link>
                            </li>

                            <li>
                                <Link to="/products">ProductList</Link>
                            </li>
                            {/* :::::::::: 휘성 products 관련 :::::::::: */}


                            <hr/>
                            <li>
                                <Link to="/login">로그인테스트</Link>
                                <br/>
                            </li>
                            <li>
                                <Link to="/signup">회원가입테스트</Link>
                                <br/>
                            </li>
                            <li>
                                <Link to="/payment">GreenPay</Link>
                            </li>
                            <br/>

                            <li>
                                <Link to="/chat">chat</Link>
                            </li>

                            <button onClick={signout}>로그아웃</button>
                            <hr/>

                            <li>
                                <Link to="/news">News</Link>
                            </li>
                            <li>
                                <Link to="/campaign">Campaign</Link>
                            </li>

                        </ul>


                        <Switch>
                            <Route path={["/", "/main"]} exact>
                                {/* <MainView /> */}
                            </Route>

                            {/* :::::::::: 휘성 products 관련 :::::::::: */}
                            <Route path="/products" exact>
                                <ProductListHeader/>
                            </Route>
                            <Route path="/products/register" exact>
                                <ProductRegistration/>
                            </Route>
                            <Route path="/products/:id" exact>
                                <ProductDetails/>
                            </Route>
                            <Route path="/products/update/:id" exact>
                                <ProductUpdate/>
                            </Route>

                            {/* :::::::::: 휘성 products 관련 :::::::::: */}

                            <Route path="/login" exact>
                                <Login/>
                            </Route>
                            <Route path="/signup" exact>
                                <SignUp/>
                            </Route>

                            <Route path="/KakaoMap" exact>
                                <ModalPage/>
                            </Route>
                            <Route path="/payment" exact>
                                <GreenPay/>
                            </Route>
                            <Route path="/payment/gpay_register" component={PayRegister}/>
                            <Route path="/payment/accnt_register" component={AccountRegister}/>

                            <Route path="/chat" exact>
                                <ChatApp/>
                            </Route>

                            <Route path="/chat/roomNum/:roomNum" component={ChatBox} exact></Route>
                            <Route path="/chat/list" component={ChatList} exact></Route>

                            <Route path="/news" exact>
                                <Youtube/>
                                <NewsList/>
                            </Route>

                            <Route path="/campaign" exact>
                                <CampaignList/>
                            </Route>

                            <Route path="/sns/snsRegistration" exact>
                                <SnsRegistration/>
                            </Route>

                        </Switch>

                    </div>


                    <ChatList/>
                    <MainFooter/>


                </ThemeProvider>
            </ResizedComponent>
        </>);
}

export default App;





