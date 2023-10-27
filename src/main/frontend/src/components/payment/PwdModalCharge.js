/**
 * @author ahrayi
 * @create date 2023-10-28 01:00:29
 * @modify date 2023-10-28 01:00:31
 */

import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import PayPassword from './PayPassword';

const PwdModalCharge = ({showPayPasswordModal,setShowPayPasswordModal,setPayPwd,postAddPayMoney,handleCloseModal}) => {
    return (
        <div>
         <Modal
                className='basefont'
                show={showPayPasswordModal}
                setPayPwd={setPayPwd}
                postAddPayMoney={postAddPayMoney}
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
                            <PayPassword setPayPwd={setPayPwd} postAddPayMoney={postAddPayMoney} onCloseModal={() => {
                                setShowPayPasswordModal(false)
                                handleCloseModal();}}/>
                        </ModalBody>
        </Modal>    
        </div>
    );
};

export default PwdModalCharge;