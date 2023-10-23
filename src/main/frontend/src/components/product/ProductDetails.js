/**
 * @author wheesunglee
 * @create date 2023-09-20 10:21:07
 * @modify date 2023-10-22 15:35:46
 */
import jwt_encode from "jwt-encode";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { useHistory } from "react-router-dom/";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import "../../assets/css/Product.css";
import {
  changeLikes,
  fetchLiked,
  fetchLikes,
  fetchProduct,
} from "../../assets/js/product";
import ImageView from "./ImageView";
import Location from "./Location";

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [data, setData] = useState({});
  const [liked, setLiked] = useState();
  const [likes, setLikes] = useState();
  const [imageList, setImageList] = useState([]);
  const [mainImage, setMainImage] = useState({});
  const [user, setUser] = useState();

  ////////////////////////////////////////
  const key = process.env.REACT_APP_JWT_KEY;
  ///////////////////////////////////////

  useEffect(() => {
    setUser(window.user);
    fetchProduct(id).then((response) => {
      if (response) {
        setData(response.data);
        setImageList(response.data.images);
      }
    });
    fetchLikes(id).then((response) => {
      if (response) {
        setLikes(response.data);
      }
    });

    fetchLiked(id).then((response) => {
      if (response) {
        setLiked(response.data);
        console.log("fetchLiked", response.data);
      }
    });
  }, []);

  useEffect(() => {
    changeLikes(id).then((response) => {
      if (response) {
        setLikes(response.data);
      }
    });
  }, [liked]);

  const {
    seller,
    name,
    price,
    description,
    category,
    latitude,
    longitude,
    images,
    createdAt,
  } = data;

  const changeLiked = (id) => {
    setLiked(!liked);
  };

  function generateRoomNum(id, seller, user) {
    const data = {
      productId: id,
      seller: seller,
      buyer: user,
    };
    const roomNum = jwt_encode(data, key);
    return roomNum;
  }

  const moveToChat = () => {
    console.log(user, "user moveToChat()");
    const roomNum = generateRoomNum(id, seller, user);
    history.push({
      pathname: `../chat/roomNum/${roomNum}`,
      state: data,
    });
  };
  console.log(user, "user");
  console.log(seller, "seller");
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
              <Col md="2">좋아요하트{likes}</Col>
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
                      onClick={() => moveToChat()}
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
                <Location latitude={latitude} longitude={longitude} />
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
