import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import TokenRefresher from '../util/TokenRefresher';

const Transaction = ({payBalance}) => {

    const [transactionHistory, setTransactionHistory] = useState([])

    useEffect(() => {
        TokenRefresher.post("http://localhost:8080/api/payment/transactionHistory")
          .then((response) => {
            setTransactionHistory(response.data);
          })
          .catch((error) => {
            console.error('거래 내역 조회 실패', error);
          });
      }, [payBalance]); 

    return (
        <>
           <TableContainer style={{ width: "80%", margin: "auto" }}>
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                    최근 이용 내역
                <TableRow>
                  <TableCell align="center" component="th">
                    구분
                  </TableCell>
                  <TableCell align="center" component="th">
                    거래일시
                  </TableCell>
                  <TableCell align="center" component="th">
                    거래품목
                  </TableCell>
                  <TableCell align="center" component="th">
                    금액
                  </TableCell>
                  <TableCell align="center" component="th">
                    비고
                  </TableCell>
                </TableRow>
              </TableHead>
  
              <TableBody>
              {transactionHistory && transactionHistory.length === 0 ? (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    이용내역이 없습니다.
                  </TableCell>
                </TableRow>
                ) : (transactionHistory.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{transaction.type}</TableCell>
                    <TableCell align="center">{transaction.transactionDtime}</TableCell>
                    <TableCell align="center">{transaction.content}</TableCell>
                    <TableCell align="center">{transaction.tranAmt}</TableCell>
                    <TableCell align="center">비고 </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
    );
};

export default Transaction;