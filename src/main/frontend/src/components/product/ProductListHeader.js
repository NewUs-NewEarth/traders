import axios from "axios";
import { React, useEffect, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../../assets/css/Product.css";
import ProductList from "./ProductList";

const ProductListHeader = () => {
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [showAvailable, setShowAvailable] = useState(false);
  const [viewNearby, setViewNearby] = useState(false);
  const history = useHistory();

  const getAllProducts = () => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => {
        setData(res.data);
      })

      .catch((error) => {
        if (error.response) {
          const errorResponse = error.response.data;
          console.log(errorResponse);
        }
      });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error(error);
          console.log("getLocation");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const sendCoordinatesToServer = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/products/nearestProducts",
        {
          params: {
            latitude: latitude,
            longitude: longitude,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    }
  };

  const getNearby = () => {
    setViewNearby(!viewNearby);
    if (viewNearby) {
      getAllProducts();
    } else {
      if (latitude !== null && longitude !== null) {
        sendCoordinatesToServer();
      }
    }
  };

  useEffect(() => {
    getLocation();
    getAllProducts();
  }, []);

  return (
    <>
      <Container style={{ maxWidth: "1040px", backgroundColor: "#fe4568" }}>
        <Stack
          direction="horizontal"
          gap={2}
          className="justify-content-center"
        >
          <button className="btn-1 bold">Category1</button>
          <button className="btn-1 bold">Category2</button>
          <button className="btn-1 bold">Category3</button>
          <button className="btn-1 bold">Category4</button>
        </Stack>

        <Row>
          <Col className="col-left-align bold-colored-font" md="4">
            {showAvailable ? "전체 보기" : "거래 가능 보기"}
            <input
              type="checkbox"
              onClick={() => setShowAvailable(!showAvailable)}
            />
          </Col>
          <Col className="col-right-align" md="4">
            <button
              className="btn-2"
              // onClick={() => setViewNearby(!viewNearby)}
              onClick={getNearby}
            >
              {viewNearby ? "전지역 물품" : "현위치 물품"}
            </button>
          </Col>
          <Col className="col-right-align" md="4">
            <button
              className="btn-1 bold"
              onClick={() => {
                history.push("products/register");
              }}
            >
              등록하기
            </button>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg="12">
            <Row>
              {data.map((product, index) => {
                if (showAvailable && product.status === "SOLD") {
                  return null;
                }
                return (
                  <Col lg="4" key={index}>
                    <ProductList product={product} />
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

export default ProductListHeader;
