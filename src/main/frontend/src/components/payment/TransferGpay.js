/**
 * @author hyunseul
 * @create date 2023-10-24 19:13:49
 * @modify date 2023-10-28 07:29:05
 * @desc [페이지 전체 템플릿 css]
 */
/**
 * @author ahrayi
 * @create date 2023-10-22 03:55:46
 * @modify date 2023-10-24 19:13:47
 * @desc 채팅 - [송금하기]
 */
/**
 * @author wheesunglee
 * @create date 2023-10-23 22:58:47
 * @modify date 2023-10-23 22:58:53
 * @desc 채팅방에서 물품 정보 받아오기
 */

import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "../../assets/css/ChatStyle.css";
import {
  useParams,
  withRouter,
} from "react-router-dom/cjs/react-router-dom.min";
import { fetchProduct } from "../../assets/js/product";
import TokenRefresher from "../util/TokenRefresher";
import {BsDot} from 'react-icons/bs'
import PayPasswordTr from "./PayPasswordTr";
import { fetchPayInfo } from "../../assets/js/payment";
import PwdModalTR from "./PwdModalTR";
import { Error, Success } from "../util/Alert";

const TransferGpay = (props) => {
    const { id } = useParams();
    const [buyer, setBuyer] = useState();
    const [product, setProduct] = useState();
    const [balance, setBalance] = useState(null);
    const [payPwd, setPayPwd] = useState(null);
    const [showPayPasswordModal, setShowPayPasswordModal] = useState(false);
    const [showTrModal, setShowTrModal] = useState(false);


    useEffect(() => {
        fetchProduct(id).then((response) => {
          if (response) {
            setProduct(response.data);
          }
        });
        setBuyer(window.user);
        
        //getBalance();
        fetchPayInfo().then((response)=>{
          if (response) {
            setBalance(response.data.payBalance);            
          }
        })
        .catch((error) => {
          console.error("결제 정보를 가져오는 중 오류 발생:", error);
        });     

      }, []);

  // 그린페이 송금
  const transferPayment = () => {
    const price = product.price
    const requestBody = {
      transferAmt: price,
      payPwd: payPwd,
      product: product,
    }
    
    TokenRefresher.post("http://localhost:8080/api/payment/transfer",requestBody)
      .then((response) => {
        if (response.status === 200) {
          const payBalance = response.data.payBalance;
          setBalance(payBalance);
          
          Success("결제 성공");
        } else {
          Error("결제 실패");
        }
    })
    .catch((error) => {
        console.error();
    });
  };
  const handleShowTrModal = () => {
    setShowTrModal(true);
  };

  const handleCloseTrModal = () => {
    setShowTrModal(false);
  };

    const toNextPage=()=>{
      setShowPayPasswordModal(true)
  }

  const updatePayPwd = (newPayPwd) => {
    setPayPwd(newPayPwd);
  };

  return (
    <>
      <br/><br/><br/><br/><br/>
      <Container style={{ width: "1040px" }}>
        {product && (
          <div className="message-container">
            <div className="chat-pay-header">
              <Col style={{ fontSize: '25pt', fontWeight: '900', marginTop: '30px',display: 'flex', justifyContent:'center' }}>결제하기</Col>
            </div>
                <hr style={{ marginTop: '30px', marginBottom: '0px' }} />
            <div style={{ backgroundColor: ' #d1d1d1' }}>
              <div style={{ paddingTop: '30px' }}>
              <div style={{ display: "flex",justifyContent:'center' }}>
                <div>
                  <br/><br/>
                  <img src={product.images[0].filepath} className="chat-pay-product-img" alt="Product"
                    style={{
                            width: "300px",
                            height: "300px",
                            objectFit: "cover",
                          }}></img>
                </div>
                <div style={{marginLeft:'30px',display: 'flex', alignItems: 'center'}}>
                  <span className="chat-product-name" 
                  style={{ fontSize: '18pt', fontWeight: '700', marginTop: '30px'}}>
                    <BsDot />상품명: {product.name}<br/>
                    <BsDot />가격: {product.price} 원
                  </span>
                </div>
                </div>
                <br />
                <span className="chat-product-pay-balance" style={{ fontSize: '18pt', fontWeight: '700', marginTop: '30px',
                        display: 'flex', justifyContent:'center'}} >
                  그린페이 잔액: {balance}원
                  {parseInt(product.price) > parseInt(balance)
                    ? ` | 🪙 부족한 금액 ${product.price - balance}원이 자동충전되어요🪙`
                    : null}
                </span>
                <br/><br/><br/>
              </div>
            </div>
       
        <Row style={{marginTop:'15px'}}>
          <button
            style={{ margin: "auto", width: "200px",backgroundColor:'#198754'}} 
            className="saveButton-2"
            id="setGpayPwd"
            onClick={toNextPage}
          >
            송금하기
          </button>
        </Row>

        </div>
        )}

      </Container>

      <PwdModalTR showPayPasswordModal={showPayPasswordModal} setShowPayPasswordModal={setShowPayPasswordModal}
        updatePayPwd={updatePayPwd} transferPayment={transferPayment}/>
    </>
  );
};

export default withRouter(TransferGpay);
