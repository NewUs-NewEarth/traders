/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-09-26 13:22:21
 * @modify date 2023-10-18 22:56:05
 * @desc [현재 위치의 경도,위도를 띄운다.]
 */
/**
 * @author wheesunglee
 * @create date 2023-10-17 01:55:00
 * @modify date 2023-10-17 01:55:00
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const NearestProductList = ({ showAvailable }) => {
  const history = useHistory();

  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [data, setData] = useState([]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const sendCoordinatesToServer = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products/nearestProducts", {
        params: {
          latitude: latitude,
          longitude: longitude,
        },
      });
      setData(response.data);
    } catch (error) {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      sendCoordinatesToServer();
    }
  }, [latitude, longitude]);

  console.log("NearestProductList");

  return (
    <>
      <Container style={{ maxWidth: "1040px", backgroundColor: "#fe4568" }}>
        <Row className="justify-content-center">
          <Col lg="12">
            <Row>
              {data.map((product, index) => {
                if (showAvailable && product.status === "SOLD") {
                  return null;
                }
                return (
                  <Col lg="4" key={index}>
                    <Card style={{ width: "18rem", color: "#198754" }}>
                      <Card.Body>
                        <img
                          alt=""
                          src={product.images[0].filepath}
                          style={{
                            height: "250px",
                            maxWidth: "250px",
                            maxHeight: "250px",
                            objectFit: "contain",
                            backgroundColor: "#8965e0",
                          }}
                        />
                        <Card.Title>{product.name}</Card.Title>
                        <button className="btn-2">
                          배지로 바꾸고 싶음 - 카테고리: {product.category}
                        </button>
                        <Card.Text>{product.description} </Card.Text>
                        <button
                          className="btn-2"
                          onClick={() =>
                            history.push(`/products/${product.id}`)
                          }
                        >
                          상세설명: 자세히보기
                        </button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NearestProductList;
