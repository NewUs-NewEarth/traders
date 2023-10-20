/**
 * @author ahrayi
 * @create date 2023-09-26 10:32:10
 * @modify date 2023-10-18 16:05:49
 * 그린페이 가입 - 1. 인증정보input 및 약관동의 처리
 */

import React, { useState } from 'react';
import Terms from './Terms';
import Form from 'react-bootstrap/Form';

const RegisterStep1 = ({ form, onText, onNext }) => {
  const {
    userName,
    userInfo,
    userGender,
    cellCarrier,
    userCellNo,
    agreeYn,
    agreeDtime
  } = form;

  const [termFlag, setTermFlag] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleTermsChange = (selectAllChecked) => {
    setTermFlag(selectAllChecked);
  };

  const handleNextClick = () => {
    if (userName === "" || userInfo === "" || userGender === "" || cellCarrier === "" || userCellNo === "") {
      alert("모든 항목을 작성해주세요."); // 유효성 검사 추가
                                          // 이름(한글20) userInfo(숫자6) userGender(숫자1) cuserCellNo(숫자11)
    } else {
      onNext();
    }
  };

  return (
    <>
      <h2>본인인증</h2>
      <p>
        <label>이름</label>
        <br />
        <input
          type="text"
          name="userName"
          value={userName}
          placeholder="이름을 입력하세요"
          onChange={onText}
        />
      </p>
      <p>
        <label>주민등록번호</label>
        <br />
        <input
          type="text"
          name="userInfo"
          value={userInfo}
          maxLength={6}
          size={6}
          onChange={onText}
          required
        />
        -
        <input
          type="password"
          name="userGender"
          value={userGender}
          maxLength={1}
          size={1}
          onChange={onText}
          required
        />
        ******
      </p>
      <p>
        <div class="input-group mb-3">
          <label>휴대폰 번호</label>
          <br />
          <Form.Select label="통신사" name="cellCarrier" value={cellCarrier} onChange={onText} required>
            <option value="SKT">
              SKT
            </option>
            <option value="KT">
              KT
            </option>
            <option value="LG U+">
              LG U+
            </option>
            <option value="SKT 알뜰폰">
              SKT 알뜰폰
            </option>
            <option value="KT 알뜰폰">
              KT 알뜰폰
            </option>
            <option value="LG U+ 알뜰폰">
              LG U+ 알뜰폰
            </option>
          </Form.Select>
          <input
            type="text"
            class="form-control"
            name="userCellNo"
            value={userCellNo}
            placeholder="휴대폰 번호를 입력하세요"
            onChange={onText}
            required
          />
        </div>
        <br />
        <br />
      </p>
      <Terms onTermsChange={handleTermsChange} selectAllChecked={selectAllChecked} setSelectAllChecked={setSelectAllChecked}/>
      <p>
        <button onClick={handleNextClick} disabled={!selectAllChecked}>다음</button>
      </p>
    </>
  );
};

export default RegisterStep1;
