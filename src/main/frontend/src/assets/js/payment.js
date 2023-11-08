/**
 * @author ahrayi
 * @create date 2023-10-28 01:00:59
 * @modify date 2023-10-28 01:01:01
 */

import TokenRefresher from "../../components/util/TokenRefresher";

// 페이 및 계좌정보 받아오기
const fetchPayInfo = () => {
  return new Promise((resolve, reject) => {
      TokenRefresher.post('http://localhost:8080/api/payment/payMgmt')
          .then((response) => {
              console.log("받아온 페이정보:", response.data);
              resolve({
                  data: response.data,
              });
          })
          .catch((error) => {
              if (error.response) {
                  const errorResponse = error.response.data;
                  console.log(errorResponse);
              }
              reject(error);
          });
  });
}

export{
    fetchPayInfo
}

