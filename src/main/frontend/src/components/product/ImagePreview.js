/**
 * @author wheesunglee
 * @create date 2023-10-07 10:48:03
 * @modify date 2023-10-20 19:46:48
 */
/**
 * @author hyunseul
 * @modify date 2023-10-18 11:11:38
 * css 수정
 */

import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ImagePreview = ({ files, deleteFile }) => {
  const [preview, setPreview] = useState([]);

  let imageUrlLists = [];
  useEffect(() => {
    for (let i = 0; i < files.length; i++) {
      const currentImageUrl = URL.createObjectURL(files[i]);
      imageUrlLists.push(currentImageUrl);
    }

    setPreview(imageUrlLists);
  }, [files]);

  const deletePreview = (indexToDelete) => {
    setPreview(preview.filter((_, index) => index !== indexToDelete));
    deleteFile(indexToDelete);
  };

  // 한 행에 3개의 이미지가 들어가도록 맵핑합니다.
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

export default ImagePreview;
