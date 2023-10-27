/**
 * @author heera youn
 * @create date 2023-10-18 21:57:51
 * @modify date 2023-10-28 06:43:41
 * @desc [그린페이 가입절차 시작]
 */

import React from "react";
import { Col, Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import "../../assets/css/payment.css";
import greenpay1 from "../../assets/img/greenpay1.jpg";
import greenpay2 from "../../assets/img/greenpay2.jpg";
import greenpay3 from "../../assets/img/greenpay3.jpg";

const GreenPay = () => {
  return (
    <Container style={{ width: "850px", marginTop: "180px" }}>
      <Row className="basefont">
        <span className="title1">그린페이 가입 시 혜택</span>

        <Col sm={4}>
          <div className="card">
            <a className="img-card" href>
              <img src={greenpay2} style={{ height: "400px" }} />
            </a>
            <div className="card-content">
              <h4 className="card-title">
                <a href>간편결제</a>
              </h4>
              <p className="">
                빠르고 신속한 간편결제 가능
                <br />
                <br />
              </p>
            </div>
            <div className="card-read-more">
              <a href className="btn btn-link btn-block">
                Read More
              </a>
            </div>
          </div>
        </Col>

        <Col sm={4}>
          <div className="card">
            <a className="img-card" href>
              <img src={greenpay1} style={{ height: "400px" }} />
            </a>
            <div className="card-content">
              <h4 className="card-title">
                <a href>페이결제 혜택</a>
              </h4>
              <p className="">거래금액의 2% 그린페이 포인트 적립혜택 제공</p>
            </div>
            <div className="card-read-more">
              <a href className="btn btn-link btn-block">
                Read More
              </a>
            </div>
          </div>
        </Col>

        <Col sm={4}>
          <div className="card">
            <a className="img-card" href>
              <img src={greenpay3} style={{ height: "400px" }} />
            </a>
            <div className="card-content">
              <h4 className="card-title">
                <a href>충전 및 현금전환</a>
              </h4>
              <p className="">
                원하는 만큼, 언제든지 충전과 현금전환 서비스 제공
              </p>
            </div>
            <div className="card-read-more">
              <a href className="btn btn-link btn-block">
                Read More
              </a>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginLeft: "800px", textAlign: "center", margin: "auto" }}>
        <Link to="/payment/gpay_register">
          <button className="saveButton-3" style={{ justifyContent: "center" }}>
            가입하기
          </button>
        </Link>
      </Row>
    </Container>
  );
};

export default GreenPay;
