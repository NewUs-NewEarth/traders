/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-09-26 13:22:21
 * @modify date 2023-10-18 16:26:12
 * @desc [현재 위치의 경도,위도를 띄운다.]
 */
/**
 * @author wheesunglee
 * @create date 2023-10-17 01:55:00
 * @modify date 2023-10-17 01:55:00
 */

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const NearestProductList = ({ product }) => {
  const [images, setImages] = useState();
  const history = useHistory();

  useEffect(() => {
    setImages(product.images);
  });

  console.log("NearestProductList");

  return (
    <>
      <Card style={{ width: "18rem", color: "#198754" }}>
        <Card.Body>
          {images && (
            <img
              alt=""
              src={images[0].filepath}
              style={{
                height: "250px",
                maxWidth: "250px",
                maxHeight: "250px",
                objectFit: "contain",
                backgroundColor: "#8965e0",
              }}
            />
          )}
          <Card.Title>{product.name}</Card.Title>
          <button className="btn-2">
            배지로 바꾸고 싶음 - 카테고리: {product.category}
          </button>
          <Card.Text>{product.description} </Card.Text>
          <button
            className="btn-2"
            onClick={() => history.push(`/products/${product.id}`)}
          >
            상세설명: 자세히보기
          </button>
        </Card.Body>
      </Card>
    </>
  );
};

export default NearestProductList;
