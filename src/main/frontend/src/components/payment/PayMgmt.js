/**
 * @author heera youn
 * @create date 2023-10-22 02:25:19
 * @modify date 2023-10-28 06:45:54
 * @desc [마이페이지 TAB1.그린페이 전환/충전, 내역테이블 ]
 */

/**
 * @author ahrayi
 * @create date 2023-10-27 22:32:17
 * @modify date 2023-10-28 01:04:51
 */


import React, { useEffect, useState } from 'react';
import { fetchPayInfo } from '../../assets/js/payment';
import PointCharge from '../member/PointCharge';
import TokenRefresher from '../util/TokenRefresher';
import { Error, Success } from "../util/Alert";
import AccountInfo from './AccountInfo';
import { Row } from 'react-bootstrap';
import WithdrawGpay from '../member/WithdrawGpay';
import Transaction from './Transaction';

const PayMgmt = (props) => {

    const [showChargeModal, setShowChargeModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [transferAmt, setTransferAmt] = useState('')
    const [payPwd, setPayPwd] = useState('')
    const [bankName, setBankName] = useState('')
    const [user, setUser] = useState();
    const [data, setData] = useState({});
    const {
        userName,
        accountNum,
        bankCodeStd,
        payBalance,
      } = data;

    useEffect(() => {

        setUser(window.user);
        fetchPayInfo().then((response)=>{
          if (response) {
            setData(response.data);
            console.log(response.data)
          }
        })
        .catch((error) => {
          console.error("결제 정보를 가져오는 중 오류 발생:", error);
        });
    }, [payBalance]);


    const handleShowChargeModal = () => {
        setShowChargeModal(true);
    };

    const handleCloseChargeModal = () => {
        setShowChargeModal(false);
    };
    
    const handleShowWithdrawModal = () => {
        setShowWithdrawModal(true);
    };
    
    const handleCloseWithdrawModal = () => {
        setShowWithdrawModal(false);
    };

    const comma = (str) => {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    };

    // 충전 요청
    const postAddPayMoney = () => {
        const requestBody = {
          transferAmt: transferAmt,
          payPwd: payPwd,
        };
        console.log(requestBody)

        TokenRefresher.post(
        "http://localhost:8080/api/payment/add",
        requestBody
        )
        .then((Response) => {
            if (Response.status === 200) {
              setData(prev => ({
                ...prev,
                payBalance: transferAmt
              }));
              console.log(Response.data);
            Success("✅ 충전 성공");
            } else {
            Error("❌ 충전 실패");
            }
        })
        .catch((error) => {
            console.error();
        });
    };

    // 내 계좌 송금 요청
    const postWdPayMoney = () => {
        const requestBody = {
        transferAmt: transferAmt,
        payPwd: payPwd,
        };
        console.log(requestBody)

        TokenRefresher.post(
        "http://localhost:8080/api/payment/withdraw",
        requestBody
        )
        .then((Response) => {
            if (Response.status === 200) {
              setData(prev => ({
                ...prev,
                payBalance: transferAmt
              }));
              console.log(Response.data);
              Success("✅ 송금 성공");
              } else {
              Error("❌ 송금 실패");
              }
        })
        .catch((error) => {
            console.error();
        });
    }; 

    return (
        <div>
            <br/><br/><br/><br/><br/><br/><br/>
            <AccountInfo userName={userName} accountNum={accountNum} bankCodeStd={bankCodeStd}/><br/>
            <Row
                style={{
                margin: "auto",
                justifyContent: "center",
                flexWrap: "nowrap",
                textAlign: "center",
                }}
            >
                <span className="titleterms" style={{ textAlign: "center" }}>
                {user && user}님의 그린페이🌿<br/>
                {payBalance && comma(payBalance)} 원
                </span>
            </Row>
  
            <Row
                style={{
                flexWrap: "nowrap",
                width: "50%",
                margin: "auto",
                marginBottom: "40px",
                }}
            >
                <button
                className="checkButton"
                style={{ width: "200px" }}
                onClick={handleShowChargeModal}
                >
                충전
                </button>
                <button
                className="backButton"
                style={{ width: "200px" }}
                onClick={handleShowWithdrawModal}
                >
                내 계좌 송금
                </button>
            </Row>

            <PointCharge
                setPayPwd={setPayPwd}
                setTransferAmt={setTransferAmt}
                postAddPayMoney={postAddPayMoney}
                showModal={showChargeModal}
                handleCloseModal={handleCloseChargeModal}
            />

            <WithdrawGpay
                setPayPwd={setPayPwd}
                setTransferAmt={setTransferAmt}
                payBalance={data.payBalance}
                postWdPayMoney={postWdPayMoney}
                showModal={showWithdrawModal}
                handleCloseModal={handleCloseWithdrawModal}
            />

            <Transaction payBalance={payBalance}/>
            
        </div>
    );
};

export default PayMgmt;
