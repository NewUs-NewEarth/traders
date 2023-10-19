/**
 * @author wheesunglee
 * @create date 2023-10-08 22:08:34
 * @modify date 2023-10-18 22:56:00
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import ImagePreview from "./ImagePreview";
import KakaoMapModal from "./KakaoMapModal";

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
    console.log(evt.target);
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
    setRemovedFiles([...removedFiles, removedFile[0].id]);
  };

  const deleteProduct = () => {
    try {
      axios.delete(`/api/products/delete/${id}`);
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
      axios
        .put(`http://localhost:8080/api/products/update/${id}`, form, {
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
    <>
      <div>
        <h1> 물품 수정 양식</h1>
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
          checked={category === "furniture"}
        />
        가구
        <input
          type="radio"
          name="category"
          value="pet"
          onChange={changeInput}
          checked={category === "pet"}
        />
        반려동물 용품
        <input
          type="radio"
          name="category"
          value="etc"
          onChange={changeInput}
          checked={category === "etc"}
        />
        기타
        <br />
        거래장소 정하기
        <KakaoMapModal onMapSubmit={handleMapSubmit} />
        <br />
        <label for="files">
          <div
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
        {images &&
          images.map((image, index) => (
            <div key={index}>
              <img src={image.filepath} width={200} alt={`Image ${index}`} />
              <button onClick={() => removeFile(index)}>삭제</button>
            </div>
          ))}
        <ImagePreview files={newFiles} deleteFile={deleteFile} />
        <br />
        <button onClick={submitData}>수정하기</button>
        <button onClick={deleteProduct}>삭제하기</button>
      </div>
    </>
  );
};

export default withRouter(ProductUpdate);
