/**
 * @author ahrayi
 * @create date 2023-10-13 16:44:23
 * @modify date 2023-10-18 19:50:27
 */

import React, { useState } from 'react';
import { TextField, MenuItem, Button } from '@mui/material';
import bankCode from './bankCode';
import axios from 'axios';

const AccountRegister1 = ({form, onText, onNext, setRanNum}) => {

    const [address,setAddress] = useState('');

    var themeObj = {
        searchBgColor: "#198754", //검색창 배경색
        queryTextColor: "#FFFFFF" //검색창 글자색
     };

    const handleAddressInput = () => {
    if (window.daum && window.daum.Postcode) {
        // 'daum' 객체 및 'Postcode' 함수가 로드된 상태에서 실행
    
        new window.daum.Postcode({
            theme: themeObj,
            popupTitle: '주소 검색 - TRADERS',
            popupKey: 'popup1',
            oncomplete: (data) => {
                // 'data' 객체에서 주소와 상세주소 정보 가져오기
                setAddress(data.address);
                onText({ target: { value: data.address, name: 'addr1' } });
        },
        }).open();
    } else {
        // 'daum' 객체나 'Postcode' 함수가 로드되지 않은 경우에 대한 처리
        console.error('Daum Postcode API is not available.');
    }
    };

    const handleAccountVerification =()=>{

        const requestBody = {
            accountNum:form.accountNum,
            addr1:form.addr1,
            addr2: form.addr2,
            bankCodeStd: form.bankCodeStd,
            clientInfo: form.clientInfo,
        }

        axios.post('http://localhost:8080/api/payment/valid-account',requestBody)
            .then(Response => {
                if(Response.status===200) {
                    console.log(Response.data)
                    setRanNum(Response.data.ranNum);

                    onNext();
                }else{
                    alert('유효하지 않은 계좌정보입니다.')
                }
            })
            .catch(error =>{
                console.error();
            })
    }

    return (
        <form>
            <TextField
                inputProps={{ maxLength: 16, inputMode: 'numeric', pattern: '[0-9]*' }}
                id="standard-error-required"
                label="계좌번호"
                type='text'
                color='success'
                variant="standard"
                required
                name='accountNum'
                onChange={onText} 
            />
            <br/><br/>

            <TextField
                style={{width: '200px'}}
                id="standard-select"
                select
                label="은행"
                color='success'
                variant="standard"
                required
                name='bankCodeStd'
                onChange={onText}
            >
                {bankCode.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <br/><br/>
                
            주소     <input type='text' id='addr1' name='addr1' value={address} required onChange={onText} readOnly></input>
                     <Button onClick={handleAddressInput}>주소입력</Button><br/>
            상세주소 <input type='text' id='addr2' name='addr2' required onChange={onText}></input>
                
            <br/><br/>
                
            <Button variant="contained" color="success" onClick={handleAccountVerification}>
                계좌 인증 요청
            </Button>

        </form>
   );
};

export default AccountRegister1;