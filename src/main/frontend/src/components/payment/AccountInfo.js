/**
 * @author ahrayi
 * @create date 2023-10-28 01:04:28
 * @modify date 2023-10-28 01:09:52
 */


import React from 'react';
import { Row } from 'react-bootstrap';
import bankCode from './bankCode';

const AccountInfo = ({userName,accountNum,bankCodeStd}) => {

  // 계좌번호 마스킹
  function maskAccountNumber(accountNum) {
    if (accountNum.length >= 7) {
        const prefix = accountNum.slice(0, 3);
        const suffix = accountNum.slice(-3);
        const masking = "*".repeat(accountNum.length - 6);
        return prefix + masking + suffix;
    }
    return accountNum;
  }

  const findBankLabel = (value) => {
    const bank = bankCode.find(item => item.value == value);
    return bank ? bank.label : '-'; 
  };

    return (
        <>
        <Row
            className="basefont"
            style={{ justifyContent: "center", margini: "40px" }}
          >
            <div className="paycard">
              <div className="cardtop">
              {userName&& userName}<br/>
                <img src="https://cdn-icons-png.flaticon.com/512/1436/1436392.png" />
              </div>
              <div className="infos">
                <section className="card-number">
                  <p className="paycardtext">Account Number</p>
                  <h1 style={{ fontSize: "20px" }}>{accountNum && maskAccountNumber(accountNum)}</h1>
                </section>
                <div className="cardbottom">
                  <aside className="infos--bottom">
                  </aside>
                  <aside>
                    <section>
                      {bankCodeStd && findBankLabel(bankCodeStd)}
                      {/* <img
                        src="https://seeklogo.com/images/V/VISA-logo-DD37676279-seeklogo.com.png"
                        className="cardbrand"
                      /> */}
                    </section>
                  </aside>
                </div>
              </div>
            </div>
          </Row>
        </>
    );
};

export default AccountInfo;