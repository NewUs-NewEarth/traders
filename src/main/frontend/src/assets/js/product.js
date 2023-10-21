/**
 * @author wheesunglee
 * @create date 2023-10-20 13:54:31
 * @modify date 2023-10-20 16:06:28
 */

import { useState } from "react";
import TokenRefresher from "../../components/service/TokenRefresher";

const fetchProduct = (id) => {
  return TokenRefresher.get(`http://localhost:8080/api/products/${id}`)
    .then((res) => {
      console.log("fetchproduct", res.data);
      return {
        data: res.data,
        images: res.data.images,
      };
    })
    .catch((error) => {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    });
};
const fetchLiked = (id) => {
  return TokenRefresher.get(`http://localhost:8080/api/redis/checkLiked/${id}`)
    .then((res) => {
      console.log("fetchliked", res.data);
      return { data: res.data };
    })
    .catch((error) => {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    });
};




export {  fetchLiked, fetchProduct };
