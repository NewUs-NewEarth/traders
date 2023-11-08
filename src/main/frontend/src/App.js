import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import PayRegister from "./components/payment/PayRegister";
import ProductDetails from "./components/product/ProductDetails";
import ProductRegistration from "./components/product/ProductRegistration";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBox from "./components/chat/ChatBox";
import ChatList from "./components/chat/ChatList";
import Elasticsearch from "./components/elasticsearch/Elasticsearch";
import MainFooter from "./components/layout/MainFooter";
import MainView from "./components/layout/MainView";
import NavBar from "./components/layout/NavBar";
import ResizedComponent from "./components/layout/ResizedComponent";
import Login from "./components/login/Login";
import { signout } from "./components/login/SignAPIService";
import SignUp from "./components/login/SignUp";
import Attendance from "./components/member/Attendance";
import MyLikes from "./components/member/MyLikes";
import Mypage from "./components/member/Mypage";
import MyProducts from "./components/member/MyProducts";
import RandomEvent from "./components/member/RandomEvent";
import Notification from "./components/Notification";
import AccountRegister from "./components/payment/AccountRegister";
import Confetti from "./components/payment/Confetti";
import PayMgmt from "./components/payment/PayMgmt";
import RegisterComplete from "./components/payment/RegisterComplete";
import TransferGpay from "./components/payment/TransferGpay";
import ProductListHeader from "./components/product/ProductListHeader";
import ProductUpdate from "./components/product/ProductUpdate";
import CampaignList from "./components/sns/CampaignList";
import NewsList from "./components/sns/NewsList";
import Youtube from "./components/sns/Youtube";
import LoadingLeaf from "./components/util/LoadingLeaf";
import { OfficialLoading } from "./components/util/OfficialLoading";
import PrivateRoute from "./components/util/PrivateRoute";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import PayLanding from "./components/payment/PayLanding";
import GreenPay from "./components/payment/GreenPay";
import { BsArrowUpCircle } from "react-icons/bs";
import { scrollToTop, TopButton } from "./components/layout/PublicComponents";

const theme = createTheme({
  typography: {
    fontFamily: "NanumSquareNeo",
  },
});

function App() {
  const user = localStorage.getItem("REFRESH_TOKEN")
    ? jwt_decode(localStorage.getItem("REFRESH_TOKEN")).sub
    : null;
  window.user = user;
  console.log("Main User", user);
  return (
    <>
      <ResizedComponent>
        <NavBar user={user} />
        <Notification />
        {/* <MainView /> */}
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <RandomEvent />

          <Switch>
            <Route path={["/", "/main"]} exact>
              <MainView />
            </Route>

            <Route component={Login} path="/login" exact />

            <Route component={SignUp} path="/signup" exact />

            <Route component={signout} path="/logout" exact />

            <Route component={Elasticsearch} path="/search/:keyword" exact />

            <Route component={ProductListHeader} path="/products" exact />

            <Route component={(Youtube, NewsList)} path="/news" exact />
          {/* <TokenRefresher/> */}
          <div className="Pretendard-Regular">
            <Switch>
              <Route path={["/", "/main"]} exact>
                <MainView />
              </Route>

            <Route component={CampaignList} path="/campaign" exact />

            {/* 마이페이지 회원 관련 */}

            <PrivateRoute component={Attendance} path="/attendance" exact />

            <PrivateRoute component={Notification} path="/notification" />

            <PrivateRoute component={MyLikes} path="/mylikes" exact />

            <PrivateRoute component={MyProducts} path="/myproducts" exact />

            <PrivateRoute component={Mypage} path="/mypage" />

            {/* 물품 관련 */}

            <PrivateRoute
              component={ProductRegistration}
              path="/products/register"
              exact
            />
            <PrivateRoute
              component={ProductUpdate}
              path="/products/update/:id"
              exact
            />

            <PrivateRoute
              component={ProductDetails}
              path="/products/:id"
              exact
            />

            {/* 채팅 관련 */}

            <PrivateRoute
              component={ChatBox}
              path="/chat/roomNum/:roomNum"
              exact
            />
            <PrivateRoute component={ChatList} path="/chat/list" exact />
            <PrivateRoute component={ChatList} path="/chat/list" exact />

              {/* 결제 관련 */}

              <Route path="/payment" exact>
                <PayLanding />
              </Route>
              <Route path="/payment/gpay_register" component={PayRegister} exact/>
              <Route path="/payment/accnt_register" component={AccountRegister} exact/>
              <Route path="/payment/myPay" component={PayMgmt} exact/>
              <Route path="/payment/accnt" component={RegisterComplete}  exact/>
              <Route path="/payment/payIntro" component={GreenPay}  exact/>
              <Route path="/payment/transfer/:id" >
                <TransferGpay />
              </Route>

              <Route path="/progress" exact></Route>

              <Route path="/loading1">
                <LoadingLeaf />
              </Route>
              <Route path="/loading2">
                <OfficialLoading />
              </Route>
              <Route path="/Random">
                <RegisterComplete />
                <Confetti />
              </Route>
            </Switch>
          </div>

            <Route path="/loading1">
              <LoadingLeaf />
            </Route>
            <Route path="/loading2">
              <OfficialLoading />
            </Route>
            <Route path="/Random">
              <RegisterComplete />
              <Confetti />
            </Route>
          </Switch>
          <BsArrowUpCircle
            onClick={scrollToTop}
            type="button"
            className="public-bottombutton"
            size="50px"
          />
          <TopButton />
          <ChatList />
          <MainFooter />
        </ThemeProvider>
      </ResizedComponent>
    </>
  );
}

export default App;
