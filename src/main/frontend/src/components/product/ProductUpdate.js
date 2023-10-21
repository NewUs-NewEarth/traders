/**
 * @author wheesunglee
 * @create date 2023-10-08 22:08:34
 * @modify date 2023-10-20 20:51:24
 */

import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useHistory, withRouter } from "react-router-dom";
import "../../assets/css/ProductRegistration.css";
import "../../styles/global.css";
import TokenRefresher from "../service/TokenRefresher";
import KakaoMapModal from "./KakaoMapModal";
import UpdateImage from "./UpdateImage";

const ProductUpdate = (props) => {
  const history = useHistory();
  const form = new FormData();

  const [data, setData] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);

  useEffect(() => {
    const { location } = props;
    setData(location.state);
  }, []);

  const {
    id,
    name,
    price,
    description,
    category,
    latitude,
    longitude,
    images,
  } = data;

  const changeInput = (evt) => {
    const { name, value, type } = evt.target;

    if (type === "file") {
      let maxSize = 20 * 1024 * 1024;

      const selectedFiles = Array.from(evt.target.files);

      let fileSize = selectedFiles[0].size;

      if (fileSize > maxSize) {
        alert("파일 사이즈는 20MB 이내로 가능합니다.");
        return;
      }

      setNewFiles([...newFiles, ...selectedFiles]);
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleMapSubmit = (location) => {
    setData({
      ...data,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const deleteFile = (indexToUpdate) => {
    const updatedFiles = newFiles.filter((_, index) => index !== indexToUpdate);
    setNewFiles(updatedFiles);
  };

  const removeFile = (indexToDelete) => {
    const removedFile = images.splice(indexToDelete, 1);
    console.log(removedFile);
    setRemovedFiles([...removedFiles, removedFile[0].id]);
  };

  const deleteProduct = () => {
    try {
      TokenRefresher.delete(`http://localhost:8080/api/products/delete/${id}`);
    } catch (error) {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    }
    setTimeout(() => {
      history.push("/products");
    }, 500);
  };

  const submitData = () => {
    console.log(data);
    newFiles.forEach((file) => {
      form.append("files", file);
    });
    form.append("removedFiles", removedFiles);
    form.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    try {
      TokenRefresher.put(
        `http://localhost:8080/api/products/update/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then((res) => console.log(res.data));
    } catch (error) {
      if (error.response) {
        const errorResponse = error.response.data;
        console.log(errorResponse);
      }
    }

    setTimeout(() => {
      history.push("/products");
    }, 500);
  };
  console.log("newFiles", newFiles);
  return (
    <body>
      <Container
        className="product"
        style={{ maxWidth: "1040px", height: "1500px" }}
      >
        <Row className="product-header">
          기본정보
          <Col sm={4} style={{ fontSize: "12pt", color: "rgb(170, 44, 44)" }}>
            *필수항목
          </Col>
        </Row>
        <Row className="product-row-sm-1">
          <hr className="product-hr" />
          <Col sm={2} className="product-col-sm-1">
            상품명<font style={{ color: "rgb(170, 44, 44)" }}>*</font>
          </Col>
          <Col sm={8}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={changeInput}
              placeholder=" 　상품명을 입력해 주세요."
              className="sm-input"
              id="custom-placeholder-1"
            />
          </Col>
          <hr className="product-hr" />
        </Row>

        <Row className="product-row-sm-1">
          <Col sm={2} className="product-col-sm-1">
            가격<font style={{ color: "rgb(170, 44, 44)" }}>*</font>
          </Col>
          <Col sm={8}>
            <input
              type="text"
              name="price"
              value={price}
              onChange={changeInput}
              placeholder="　가격을 입력해 주세요.　　　　　　　　　　원"
              id="custom-placeholder-1"
              className="sm-input-price"
            />
          </Col>
          <hr className="product-hr" />
        </Row>

        <Row className="product-row-sm-2">
          <Col sm={2} className="product-col-sm-1">
            설명<font style={{ color: "rgb(170, 44, 44)" }}>*</font>
          </Col>
          <Col sm={8}>
            <textarea
              name="description"
              value={description}
              onChange={changeInput}
              rows={10}
              resize="none"
              className="product-textarea"
              id="custom-placeholder"
              placeholder=" 구매시기, 브랜드/모델명, 제품의 상태(사용감, 하자 유무)등을 입력해 주세요.
              서로가 믿고 거래할 수 있도록, 자세한 정보와 다양한 각도의 상품 사진을 올려주세요."
            />
          </Col>
        </Row>
        <Row className="product-row-sm-1">
          <Col sm={2} className="product-col-sm-1">
            카테고리<font style={{ color: "rgb(170, 44, 44)" }}>*</font>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="femaleClothing"
              name="category"
              value="femaleClothing"
              onChange={changeInput}
              checked={category === "femaleClothing"}
            />
            <label htmlFor="femaleClothing">여성의류</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="maleClothing"
              name="category"
              value="maleClothing"
              onChange={changeInput}
              checked={category === "maleClothing"}
            />
            <label htmlFor="maleClothing">남성의류</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="shoes"
              name="category"
              value="shoes"
              onChange={changeInput}
              checked={category === "shoes"}
            />
            <label htmlFor="shoes">신발</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="bags"
              name="category"
              value="bags"
              onChange={changeInput}
              checked={category === "bags"}
            />
            <label htmlFor="bags">가방/지갑</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="pet"
              name="category"
              value="pet"
              onChange={changeInput}
              checked={category === "pet"}
            />
            <label htmlFor="pet">반려동물용품</label>
          </Col>
        </Row>
        <Row className="product-row-sm-1">
          <Col sm={2} className="product-col-sm-1"></Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="digital"
              name="category"
              value="digital"
              onChange={changeInput}
              checked={category === "digital"}
            />
            <label htmlFor="digital">디지털</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="appliances"
              name="category"
              value="appliances"
              onChange={changeInput}
              checked={category === "appliances"}
            />
            <label htmlFor="appliances">가전제품</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="sports"
              name="category"
              value="sports"
              onChange={changeInput}
              checked={category === "sports"}
            />
            <label htmlFor="sports">스포츠/레저</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="culture"
              name="category"
              value="culture"
              onChange={changeInput}
              checked={category === "culture"}
            />
            <label htmlFor="culture">도서/티켓/문구</label>
          </Col>
          <Col sm={2} className="custom-radio">
            <input
              type="radio"
              id="furniture"
              name="category"
              value="furniture"
              onChange={changeInput}
              checked={category === "furniture"}
            />
            <label htmlFor="culture">가구/인테리어</label>
          </Col>
        </Row>
        <Row className="product-row-sm-1">
          <Col sm={2} className="product-col-sm-1">
            거래지역<font style={{ color: "rgb(170, 44, 44)" }}>*</font>
          </Col>

          <Col sm={1} className="product-col-sm-1">
            <KakaoMapModal
              onMapSubmit={handleMapSubmit}
              className="modal-button"
            />
          </Col>
          <hr className="product-hr" />
        </Row>
        <Row className="product-row-sm-1">
          <Col sm={2} className="sm-col-img">
            상품이미지<font style={{ color: "rgb(170, 44, 44)" }}>*</font>
            <font style={{ color: " #7d807f", fontSize: "12pt" }}></font>
          </Col>

          <Col sm={2}>
            <label htmlFor="files">
              <div className="btn-upload ">
                <font className="file-text">이미지 등록</font>
              </div>
            </label>
            <input
              name="files"
              id="files"
              type="file"
              accept="image/png, image/jpeg"
              onChange={changeInput}
              style={{ display: "none" }}
            />
          </Col>
          <Row Row className="product-row-sm-1">
            {images && (
              <UpdateImage
                images={images}
                removeFile={removeFile}
                newFiles={newFiles}
                deleteFile={deleteFile}
              />
            )}
          </Row>
        </Row>
        <hr className="product-hr" style={{ marginTop: "50px" }} />

        <Row className="product-row-sm-1">
          <Col className="product-col-sm-1">
            <button
              onClick={() =>
                setTimeout(() => {
                  history.push("/products");
                }, 500)
              }
              className="saveButton"
              style={{ backgroundColor: "#d0d0d0", color: "rgb(88, 88, 88)" }}
            >
              뒤로가기
            </button>
            <button onClick={submitData} className="saveButton">
              수정하기
            </button>
            <button
              onClick={() => history.push("../products")}
              className="saveButton"
            >
              삭제하기
            </button>
          </Col>
        </Row>
      </Container>
    </body>
  );
};

export default withRouter(ProductUpdate);
