/**
 * @author heera youn
 * @create date 2023-10-22 23:27:59
 * @modify date 2023-10-28 04:16:29
 * @desc [그린페이 충전 및 환급 모달 페이지]
 * 부모, 자식 모달 창 모두 닫히게 수정
 */

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../assets/css/ChatMapModal.css';
import { Col } from 'react-bootstrap';
import PwdModalCharge from '../payment/PwdModalCharge';
import { Error } from '../util/Alert';


const PointCharge = ({ setPayPwd, setTransferAmt, postAddPayMoney, showModal, handleCloseModal }) => {
    const [showPayPasswordModal, setShowPayPasswordModal] = useState(false);
    const [counter, setCounter] = useState(0);
    
    const handleClosePayPasswordModal = () => {
        setShowPayPasswordModal(false);
      };

    // 숫자 버튼을 클릭할 때 해당 버튼의 값이 counter에 추가되도록 처리
    const handleNumberClick = (number) => {
        if (number === "00") {
            setCounter(counter * 100 + parseInt(number));
        } else if(number==="0"){
            setCounter(counter * 10 + parseInt(number));
        } else if (number === "delete") {
            setCounter(Math.floor(counter / 10));
        } else {
            setCounter(counter * 10 + parseInt(number));
        }
    }

    const inputPriceFormat = (str) => {
        const comma = (str) => {
          str = String(str);
          return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
        };
        const uncomma = (str) => {
          str = String(str);
          return str.replace(/[^\d]+/g, "");
        };
        return comma(uncomma(str));
      };

    const toNextPage=()=>{
        const inputAmount = counter;
        if (inputAmount === 0) {
            Error("금액을 입력하세요.");
            return;
        }
        
        if (inputAmount <= 2000000) {
            setTransferAmt(inputAmount);
            setShowPayPasswordModal(true);
        } else {
            Error("200만 원을 초과할 수 없습니다.");
            setCounter(2000000);
            setTransferAmt(2000000);
        }
    }

    return (
    <div>
    <Modal className='basefont' show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-center w-100 title" style={{marginLeft:'5px'}}>&nbsp;&nbsp;그린페이 충전하기
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{margin:'auto', justifyContent:'center'}}>
                <p style={{textAlign:'center'}} className='allterms'>
                    충전하실 금액을 입력해주세요.
                </p>
                
                <p className='titleterms' style={{ textAlign: 'center' }}>
                    {inputPriceFormat(counter)}
                </p>
                
                <Col style={{margin:'10px'}}>
                <span>충전 : </span><button onClick={()=> setCounter(counter+10000)
                }className='chargeButton'> + 1만원</button>
                <button onClick={()=> setCounter(counter+50000)
                }className='chargeButton'>+ 5만원</button>
                <button onClick={()=> setCounter(counter+100000)
                }className='chargeButton'>+ 10만원</button>
                </Col><br/>
                
                <div className style={{margin:'auto'}}>
                <div className style={{textAlign:'center'}}>
                    <button onClick={() => handleNumberClick(1)} className='paybutton'>1</button>
                    <button onClick={() => handleNumberClick(2)}
                    className='paybutton'>2</button>
                    <button onClick={() => handleNumberClick(3)}
                    className='paybutton'>3</button>
                </div>
                <div className style={{textAlign:'center'}}>
                    <button onClick={() => handleNumberClick(4)}
                    className='paybutton'>4</button>
                    <button onClick={() => handleNumberClick(5)}
                    className='paybutton'>5</button>
                    <button onClick={() => handleNumberClick(6)}
                    className='paybutton'>6</button>
                </div>
                <div className style={{textAlign:'center'}}>
                    <button onClick={() => handleNumberClick(7)}
                    className='paybutton'>7</button>
                    <button onClick={() => handleNumberClick(8)}
                    className='paybutton'>8</button>
                    <button onClick={() => handleNumberClick(9)}
                    className='paybutton'>9</button>
                </div>
                <div className style={{textAlign:'center'}}>
                    <button onClick={() => handleNumberClick("00")}
                    className='paybutton'>00</button>
                    <button onClick={() => handleNumberClick("0")}
                    className='paybutton'>0</button>
                    <button onClick={() => handleNumberClick("delete")}
                    className='paybutton'>←</button>
                </div>
                </div>    
            </Modal.Body>

            <Modal.Footer>
                <Button className='cancelButton-1' variant="secondary" 
                onClick={handleCloseModal}>취소</Button>
                <Button className="saveButton-1" 
                variant="primary" 
                onClick={toNextPage}>충전</Button>
            </Modal.Footer>
    </Modal>  

    <PwdModalCharge showPayPasswordModal={showPayPasswordModal} setShowPayPasswordModal={setShowPayPasswordModal} setPayPwd={setPayPwd} postAddPayMoney={postAddPayMoney}
    handleCloseModal={handleCloseModal}/>
    
        </div>
    );
};

export default PointCharge;