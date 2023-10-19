/**
 * @author wheesunglee
 * @create date 2023-09-20 10:19:28
 * @modify date 2023-10-18 15:52:37
 */

import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ProductList = ({ data, showAvailable }) => {
  const history = useHistory();

  console.log("ProductList");
  return (
    <>
      <Row className="justify-content-center">
        <Col lg="12">
          <Row>
            {data.map((product, index) => {
              console.log(product.images[0])
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
                        Badge로 바꾸고 싶음 - 카테고리: {product.category}
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
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </>

    // <div>
    //   <h1>ProductController의 showAllProducts()</h1>
    //   <button onClick={() => setShowAvailable(!showAvailable)}>
    //     {showAvailable ? "전체 상품 보기" : "거래 가능한 상품 보기"}
    //   </button>
    //   <ul>
    //     {data.map((product, index) => {
    //       if (showAvailable && product.status === "SOLD") {
    //         return null;
    //       }
    //       return (
    //         <li key={index}>
    //           {product.id}/{product.name}
    //           <br />
    //           {product.images.map((image, index) => (
    //             <div key={index}>
    //               <img
    //                 src={image.filepath}
    //                 width={200}
    //                 alt={`Image ${index}`}
    //               />
    //             </div>
    //           ))}
    //           <Link to={`/products/${product.id}`}>ProductDetails</Link>
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </div>
  );
};
export default ProductList;
