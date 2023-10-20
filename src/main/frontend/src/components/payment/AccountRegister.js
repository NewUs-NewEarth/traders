/**
 * @author ahrayi
 * @create date 2023-10-13 12:56:57
 * @modify date 2023-10-18 19:35:55
 * @desc 그린페이 계좌등록 프로세스
 */

import React, { useState } from 'react';

import AccountRegister1 from './AccountRegister1';
import AccountRegister2 from './AccountRegister2';
import AccountRegister3 from './AccountRegister3';
import AccountRegister4 from './AccountRegister4';
import axios from 'axios';

const AccountRegister = () => {

    const [step, setStep] = useState(1);
    const [ranNum, setRanNum] = useState('');
    const [form, setForm] = useState({
      clientInfo: '33',
      accountNum: '',
      bankCodeStd: '',
      addr1: '',
      addr2: '',
    });

    const onNext = () => {
      setStep((state) => state + 1);
    };
    const onPrev = () => {
      setStep((state) => state - 1);
    };

    const onText = (evt) => {
      const { value, name } = evt.target;
      setForm({
        ...form,
        [name]: value,
      });
    };

    const postAccountInfo =()=>{

      const requestBody={
        clientInfo:form.clientInfo,
        userName:'이아라',
        accountNum:form.accountNum,
        bankCodeStd:form.bankCodeStd,
        agreeWdTr:'',
        addr1:form.addr1,
        addr2:form.addr2,
      }

      axios.post('http://localhost:8080/api/payment/save-account',requestBody)
          .then(Response => {
              if(Response.status===200) {
                  console.log(Response.data)
                  alert('계좌등록성공')
                  onNext();
              }else{
                  alert('계좌등록실패')
              }
          })
          .catch(error =>{
              console.error();
          })
  }

    return (
        <div>
            {step===1 && (
                <AccountRegister1 onNext={onNext} onText={onText} form={form} setRanNum={setRanNum}/>
            )}
            {step===2 && <AccountRegister2 onNext={onNext} ranNum={ranNum}/>}
            {step===3 && <AccountRegister3 postAccountInfo={postAccountInfo}/>}
            {step===4 && <AccountRegister4 onNext={onNext}/>}
        </div>
    );
};

export default AccountRegister;