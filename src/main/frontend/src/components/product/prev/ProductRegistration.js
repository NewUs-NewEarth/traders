/**
 * @author wheesunglee
 * @create date 2023-09-30 13:38:26
 * @modify date 2023-10-18 23:01:37
 */

import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ImagePreview from "./ImagePreview";
import KakaoMapModal from "./KakaoMapModal";

const ProductRegistration = () => {
  const form = new FormData();

  const [data, setData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    latitude: 0.0,
    longitude: 0.0,
  });

  const { name, price, description, category } = data;
  const [files, setFiles] = useState([]);

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
      setFiles([...files, ...selectedFiles]);
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

  const deleteFile = (indexToDelete) => {
    const updatedFiles = files.filter((_, index) => index !== indexToDelete);
    setFiles(updatedFiles);
  };

  const history = useHistory();

  const submitData = () => {
    files.forEach((file) => {
      form.append("files", file);
    });
    form.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    console.log(files);
    console.log(data);
    try {
      axios
        .post("http://localhost:8080/api/products/register", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => console.log(res.data));
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

  return (
    <div>
      <h1> 물품 등록 양식</h1>
      제목
      <input type="text" name="name" value={name} onChange={changeInput} />
      <br />
      가격
      <input type="text" name="price" value={price} onChange={changeInput} />
      <br />
      상세설명
      <textarea
        name="description"
        value={description}
        onChange={changeInput}
        rows={10}
      />
      <br />
      <input
        type="radio"
        name="category"
        value="furniture"
        onChange={changeInput}
      />
      가구
      <input type="radio" name="category" value="pet" onChange={changeInput} />
      반려동물 용품
      <input type="radio" name="category" value="etc" onChange={changeInput} />
      기타
      <br />
      거래장소 정하기
      <KakaoMapModal onMapSubmit={handleMapSubmit} />
      <br />
      <label for="files">
        <div
          class="btn-upload"
          style={{
            border: "1px solid rgb(77,77,77)",
            width: "150px",
            height: "30px",
            borderRadius: "10px",
          }}
        >
          파일 업로드하기
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
      <ImagePreview files={files} deleteFile={deleteFile} />
      <br />
      <button onClick={submitData}>상품작성완료</button>
    </div>
  );
};

export default ProductRegistration;
