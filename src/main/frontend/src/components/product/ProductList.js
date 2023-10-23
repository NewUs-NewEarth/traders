/**
 * @author wheesunglee
 * @create date 2023-09-20 10:19:28
 * @modify date 2023-10-21 22:08:21
 */

import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const ProductList = ({ product }) => {
  const [images, setImages] = useState();
  const history = useHistory();
  const { kakao } = window;
  const [address, setAddress] = useState();

  const getAddress = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder();
    const coord = new kakao.maps.LatLng(lat, lng);
    const callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        setAddress(result[0].address.region_3depth_name);
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  useEffect(() => {
    setTimeout(() => {
      setImages(product.images);
      getAddress(product.latitude, product.longitude);
    }, 100);
  }, [images]);

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
            {address}
            상세설명: 자세히보기
          </button>
        </Card.Body>
      </Card>
    </>
  );
};
export default ProductList;
