/**
 * @author ahrayi
 * @create date 2023-10-28 02:12:58
 * @modify date 2023-10-28 02:13:28
 */
/**
 * @author heera youn
 * @email [example@mail.com]
 * @create date 2023-10-24 10:12:21
 * @modify date 2023-10-28 02:12:57
 * @desc [충전 페이 자식 모달 비밀번호 입력창 구현 FE + CSS]
 */



import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import PayPasswordWd from './PayPasswordWd';

const PwdModalWd = ({showPayPasswordModal,setShowPayPasswordModal,setPayPwd,postWdPayMoney,handleCloseModal}) => {
    return (
        <div>
         <Modal
                className='basefont'
                show={showPayPasswordModal}
                setPayPwd={setPayPwd}
                postWdPayMoney={postWdPayMoney}
                onHide={() => {
                setShowPayPasswordModal(false)
                handleCloseModal();
                }} centered>
                    <ModalHeader closeButton>
                        <ModalTitle className="text-center w-100 title" 
                        style={{marginLeft:'5px'}}>&nbsp;&nbsp;그린페이 비밀번호 입력
                    </ModalTitle>
                    </ModalHeader>
                    
                        <ModalBody>
                            <PayPasswordWd setPayPwd={setPayPwd} postWdPayMoney={postWdPayMoney} onCloseModal={() => {
                                setShowPayPasswordModal(false)
                                handleCloseModal();}}/>
                        </ModalBody>
        </Modal>    
        </div>
    );
};

export default PwdModalWd;