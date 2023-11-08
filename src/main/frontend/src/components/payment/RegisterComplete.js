/**
 * @author heera youn
 * @create date 2023-10-22 23:28:10
 * @modify date 2023-10-28 05:30:13
 * @desc 등록완료 시 FE + CSS(애니메이션 효과)
 */

import React from "react";
import PayRegister from "../../assets/css/PayRegister.css";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Confetti from "./Confetti";

/* - 등록계좌 존재 시 계좌 정보 띄우고 수정/삭제로  */

const RegisterComplete = () => {
  return (
    <div className="basefont">
      <div
        className="js-container container"
        style={{ width: "850px", marginTop: "180PX" }}
      ></div>
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="checkmark-circle">
          <div className="background"></div>
          <div className="checkmark draw"></div>
        </div>
            <h2 className='title1'>그린페이 등록완료</h2>
            <p>계좌를 연결하여 그린페이 가입을 완료해주세요</p>
            <Link to="/payment/accnt_register">
                <button className='submit-btn'>계좌 연결</button>
            </Link>
            </div>
    </div>
  );
};

export default RegisterComplete;
