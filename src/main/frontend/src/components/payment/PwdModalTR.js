/**
 * @author heera youn
 * @email [example@mail.com]
 * @create date 2023-10-24 10:12:21
 * @modify date 2023-10-28 07:22:06
 * @desc [거래 페이지 자식 모달 비밀번호 입력창 구현 FE + CSS]
 */

/**
 * @author ahrayi
 * @create date 2023-10-28 01:00:29
 * @modify date 2023-10-28 02:12:01
 */

import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import PayPasswordTr from './PayPasswordTr';

const PwdModalTR = ({showPayPasswordModal,setShowPayPasswordModal,updatePayPwd, transferPayment}) => {
    return (
        <div>
         <Modal
                className='basefont'
                show={showPayPasswordModal}
                onHide={() => setShowPayPasswordModal(false)}
                centered>
                    <ModalHeader closeButton>
                        <ModalTitle className="text-center w-100 title" 
                        style={{marginLeft:'5px'}}>&nbsp;&nbsp;그린페이 비밀번호 입력
                    </ModalTitle>
                    </ModalHeader>
                    
                        <ModalBody>
                            <PayPasswordTr updatePayPwd={updatePayPwd} 
                            setShowPayPasswordModal={setShowPayPasswordModal}
                            transferPayment={transferPayment}/>
                        </ModalBody>
        </Modal>    
        </div>
    );
};

export default PwdModalTR;