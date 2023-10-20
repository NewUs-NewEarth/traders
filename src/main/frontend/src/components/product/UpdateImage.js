import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { AiOutlineCloseCircle } from "react-icons/ai";

const UpdateImage = ({ images, removeFile, newFiles, deleteFile }) => {
  const [preview, setPreview] = useState([]);
  console.log(typeof images);
  let prevFilesCnt = images.length;

  let imageUrlLists = [];
  useEffect(() => {
    prevFilesCnt = images.length;
    for (let i = 0; i < images.length; i++) {
      imageUrlLists.push(images[i].filepath);
    }
    for (let i = 0; i < newFiles.length; i++) {
      const currentImageUrl = URL.createObjectURL(newFiles[i]);
      imageUrlLists.push(currentImageUrl);
    }

    setPreview(imageUrlLists);
  }, [newFiles, images]);

  console.log(prevFilesCnt, "예전목록 개수");
  console.log("updateimage", preview);
  const deletePreview = (indexToDelete) => {
    setPreview(preview.filter((_, index) => index !== indexToDelete));
    if (indexToDelete >= prevFilesCnt) {
      deleteFile(indexToDelete);
    } else {
      removeFile(indexToDelete);
      prevFilesCnt -= 1;
    }
  };
  const rows = [];
  for (let i = 0; i < preview.length; i += 3) {
    rows.push(
      <Row key={i}>
        {preview.slice(i, i + 3).map((image, index) => (
          <Col sm={4} key={index}>
            <div className="square-box">
              <img src={image} width={300} height={300} className="img-pre" />
            </div>
            <AiOutlineCloseCircle
              onClick={() => deletePreview(i + index)}
              className="delete-btn"
            >
              취소
            </AiOutlineCloseCircle>
          </Col>
        ))}
      </Row>
    );
  }
  return <Container>{rows}</Container>;
};

export default UpdateImage;
