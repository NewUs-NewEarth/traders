import React from "react";
import { Link, Route, Switch } from "react-router-dom/cjs/react-router-dom";
import Main from "./components/Main";
import Login from "./components/login/Login";
import Redirection from "./components/login/Redirection";
import GreenPay from "./components/payment/GreenPay";
import PayRegister from "./components/payment/PayRegister";
import KakaoMap from "./components/product/KakaoMap";
import LocationComponent from "./components/product/LocationComponent";
import ProductDetails from "./components/product/ProductDetails";
import ProductList from "./components/product/ProductList";
import Chat1 from "./components/chat/Chat1";
import ChatMain from "./components/ChatMain";
import ChatApp from "./components/chat/ChatApp";
import ChatBox from "./components/chat/ChatBox";

function App() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">ProductList</Link>
        </li>

        <li>
          <Link to="/login">login</Link>
        </li>
        <li>
          <Link to="/kakaomap">KakaoMap</Link>
        </li>
        <li>
          <Link to="/payment">GreenPay</Link>
        </li>
        <li>
          <Link to="/login">login</Link>
        </li>
        <li>
          <Link to="/chat">chat</Link>
        </li>
      </ul>

      <Switch>
        <Route path={["/", "/main"]} exact>
          <Main />
        </Route>
        <Route path="/products" exact>
          <ProductList />
        </Route>
        <Route path="/products/:id" exact>
          <ProductDetails />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/redirect" exact>
          <Redirection />
        </Route>
        <Route path="/kakaomap" exact>
          <KakaoMap />
          <LocationComponent />
        </Route>
        <Route path="/payment" exact>
          <GreenPay />
        </Route>
        <Route path="/payment/gpay_register" component={PayRegister} />


        <Route path="/chat" exact>
          <ChatApp />
        </Route>
      
        <Route path="/chat/roomNum/:roomNum" component={ChatBox} ><ChatBox></ChatBox></Route>





       
       
      </Switch>
    </div>
  );
}

export default App;
