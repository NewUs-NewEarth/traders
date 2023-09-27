/**
 * @author ahrayi
 * @create date 2023-09-26 13:20:05
 * @modify date 2023-09-27 16:27:36
 * 그린페이 가입 - 2. 문자인증 처리
 */

import React, { useState } from "react";

const RegisterStep2 = ({ inputAuthNum, authNum, onText, onNext }) => {
  const [authBtnFlag, setAuthBtnFlag] = useState(false);

  function toggleAuthNumBtn() {
    setAuthBtnFlag(!authBtnFlag);
  }

  function authorizeNum(inputAuthNum, authNum, setStep) {
    {
      /* inputAuthNum과 authNum을 대조 */
    }
    onNext();
  }

  return (
    <div>
      <h2>문자 인증</h2>
      <button
        name="authNumBtn"
        onClick={toggleAuthNumBtn}
        disabled={authBtnFlag}
      >
        인증번호 받기
      </button>
      <br />
      {authBtnFlag && (
        <div>
          <input
            type="text"
            name="inputAuthNum"
            maxLength={6}
            size={6}
            onChange={onText}
          />
          <button onClick={() => authorizeNum(inputAuthNum, authNum)}>
            인증
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterStep2;