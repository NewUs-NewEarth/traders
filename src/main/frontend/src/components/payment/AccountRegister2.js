/**
 * @author ahrayi
 * @create date 2023-10-13 16:31:55
 * @modify date 2023-10-18 19:23:35
 */

import React, { useEffect, useState } from 'react';

const AccountRegister2 = ({onNext, ranNum}) => {

    const [inputRanNum, setInputRanNum] = useState(""); 

    const verifyRanNum =()=>{
        if(ranNum==inputRanNum){
            onNext();
        }else{
            alert("올바르지 않은 번호입니다.")
        }
    }

    useEffect(() => {
        setInputRanNum(ranNum);
    }, [ranNum]);

    return (
        <div>
            <h2>계좌 인증</h2>
            계좌 거래내역에서 입금된 1원의 입금자명을 확인 후,<br/>
            '그린' 뒤 3자리 숫자를 입력해주세요.<br/><br/>

            ~예시그림~

            <br/><br/>

            <input type='text' name='inputRanNum' maxLength={3} value={inputRanNum} onChange={(evt)=>setInputRanNum(evt.target.value)}/>

            <br/><br/>
            
            <button onClick={verifyRanNum}>확인</button>

        </div>
    );
};

export default AccountRegister2;