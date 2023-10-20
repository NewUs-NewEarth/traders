/**
 * @author ahrayi
 * @create date 2023-09-26 14:00:35
 * @modify date 2023-10-19 14:01:02
 * 그린페이 가입 - 3. 간편비밀번호 설정
 */

import React, { useState } from "react";

const RegisterStep3 = ({ onNext, setGpayPwd }) => {

  const [password,setPassword] = useState('');

  // 0~9와 총 10개의 문자 배열을 랜덤하게 섞은 배열
  const [randomCharacters] = useState(
    shuffleArray(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
  );

  // 숫자 키패드를 3개씩 묶어서 저장
  const keypadRows = chunkArray(randomCharacters, 3);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleClearButtonClick = () => {
    setPassword("");
  };

  const handleDeleteButtonClick = () => {
    setPassword(password.slice(0, -1));
  };

  const handleKeypadButtonClick = (character) => {
    setPassword(password + character);
  };

  // 배열을 랜덤하게 섞는 함수
  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  // 배열을 지정된 크기로 나누는 함수
  function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  function handleGpayPwd(password) {
    if (password.length===6){
      setGpayPwd(password)
      console.log('비밀번호1: ' + password)
      onNext();
    }else{
      alert("비밀번호 6자리를 입력해주세요.")
    }
  }

  return (
    <div>
      <h2>간편비밀번호 설정</h2>
      페이에 사용할 6자리 비밀번호를 입력해주세요.
      <br />
      <input type="password" id="gpayPwd" maxLength={6} size={6} value={password} onChange={handlePasswordChange} readOnly/>
      <div id="keypad">
        {keypadRows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((character) => (
              <button
                key={character}
                onClick={() => handleKeypadButtonClick(character)}
              >
                {character}
              </button>
            ))}
          </div>
        ))}
        <button key={"C"} onClick={handleClearButtonClick}>
          C
        </button>
        <button key={"←"} onClick={handleDeleteButtonClick}>
          ←
        </button>
      </div>
      <button id="setGpayPwd" onClick={() => handleGpayPwd(password)}>
        확인
      </button>
    </div>
  );
};

export default RegisterStep3;
