/**
 * @author ahrayi
 * @create date 2022-10-23 03:45:27
 * @modify date 2023-10-28 07:21:52
 * @desc 페이비밀번호 입력창
 */

/**
 * @author heera youn
 * @create date 2023-10-24 10:12:21
 * @modify date 2023-10-24 11:14:17
 * @desc 거래 자식 모달 비밀번호 입력창 구현 FE + CSS]
 */

import React, { useEffect, useState } from 'react';
import { Error, Warn } from '../util/Alert';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import '../../assets/css/PinNum.css'

const PayPasswordTr = ({ setShowPayPasswordModal, updatePayPwd, transferPayment }) => {
    const [pin, setPin] = useState('');
    const history = useHistory('');

  useEffect(() => {
    if (pin !== "") {
      updatePayPwd(pin);
    }
  }, [pin, updatePayPwd]);

  const addNumber = (number) => {
    setPin((prevPin) => prevPin + number);
  };

  const clearForm = () => {
    setPin("");
  };

    const submitForm = () => {
        if (pin === '') {
            Error('페이비밀번호를 입력하세요');
        } else {
            updatePayPwd(pin);
            transferPayment();
            clearForm();
            setShowPayPasswordModal(false);
            Warn('결제가 요청되었습니다!');
            history.push("/payment");
        }
    };

    // 버튼 배열 생성
    const buttonLayout = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['clear', 0, 'enter'],
    ];
    
    return (
        <div>
          {buttonLayout.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((button, buttonIndex) => (
                <input
                  key={buttonIndex}
                  type="button"
                  className={`PINbutton ${
                    button === "enter"
                      ? "enter"
                      : button === "clear"
                      ? "clear"
                      : ""
                  }`}
                  value={
                    button === "enter"
                      ? "enter"
                      : button === "clear"
                      ? "clear"
                      : button
                  }
                  onClick={() =>
                    button === "enter"
                      ? submitForm()
                      : button === "clear"
                      ? clearForm()
                      : addNumber(button)
                  }
                />
              ))}
            </div>
          ))}
        </div>
  );
};

export default PayPasswordTr;
