/**
 * @author wheesunglee
 * @create date 2023-09-20 10:21:07
 * @modify date 2023-10-19 01:29:52
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/";
import "../../assets/css/Product.css";
import ImageView from "./ImageView";
import ModalPage from "./ModalPage";

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [data, setData] = useState({});
  const [liked, setLiked] = useState();
  const [imageList, setImageList] = useState([]);
  const [mainImage, setMainImage] = useState({});
  const seller = "배수지";
  // const user = "배수지";
  const user = "유인나";

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        setData(res.data);
        setImageList(res.data.images);
        setLiked(res.data.liked);
      })
      .catch((error) => {
        if (error.response) {
          const errorResponse = error.response.data;
          console.log(errorResponse);
        }
      });
  }, [liked]);

  const {
    name,
    price,
    description,
    category,
    latitude,
    longitude,
    images,
    likes,
    createdAt,
  } = data;

  const changeLiked = (id) => {
    setLiked(!liked);
    axios.put(`/api/redis/changeLikes/${id}`).catch((error) => {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    });
  };
  return (
    <>
      <Container style={{ maxWidth: "1040px", backgroundColor: "#fe4568" }}>
        <Row>
          <Col md="6">{images && <ImageView imageList={images} />}</Col>
          <Col md="6">
            <div className="col-right-align">
              {seller === user && (
                <button
                  className="btn-1 bold"
                  onClick={() => {
                    history.push({
                      pathname: "/products/update/" + id,
                      state: data,
                    });
                  }}
                >
                  수정하기
                </button>
              )}
            </div>
            <div>
              <div>카테고리: {category}</div>
              <h3>상품명: {name}</h3>
              <div>금액: {price}</div>
            </div>
            <hr
              style={{
                height: " 0",
                margin: "1rem 0.5rem 0.5rem 0rem",
                overflow: "hidden",
                borderTop: "1px solid #e9ecef",
              }}
            />
            <Row>
              <Col md="2">{likes}</Col>
              <Col md="10">
                <div className="text-right">등록일시: {createdAt}</div>
              </Col>
              {seller === user ? null : (
                <div className="mt-4">
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="justify-content-center"
                  >
                    <button
                      className="btn-1 bold"
                      onClick={() => changeLiked(id)}
                    >
                      {liked ? "찜 취소" : "찜하기"}
                    </button>
                    <button
                      className="btn-1 bold"
                      color="default"
                      type="button"
                      onClick={() =>
                        history.push({
                          path: "../chat/room",
                          state: data,
                        })
                      }
                    >
                      채팅하기
                    </button>
                  </Stack>
                </div>
              )}
            </Row>
          </Col>
        </Row>
        <hr
          style={{
            height: " 0",
            margin: "1rem 0.5rem 0.5rem 0.5rem",
            overflow: "hidden",
            borderTop: "1px solid #e9ecef",
          }}
        />
        <Row>
          <Col md="6">
            <div className="text-center ">
              <h3>거래희망장소</h3>
              <div className="justify-content-center">
                <ModalPage lat={latitude} lng={longitude} />
              </div>
            </div>
          </Col>
          <Col md="6">
            <div className="text-center">
              <h3>판매자 정보</h3>
              {seller}
            </div>
            <hr
              style={{
                height: " 0",
                margin: "1rem 1rem 0.5rem 0.5rem",
                overflow: "hidden",
                borderTop: "1px solid #e9ecef",
              }}
            />
            <div className="text-center">
              <h3>상세설명</h3>
              {description}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;
