/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-20 11:17:11
 * @modify date 2023-10-20 11:25:57
 * @desc [SnsRegistration의 상위 항목]
 */

import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';

const SnsImagePreview = ({ files, deleteFile }) => {
  const [preview, setPreview] = useState([]);

  let imageUrlLists = [];
  useEffect(() => {
    for (let i = 0; i < files.length; i++) {
      const currentImageUrl = URL.createObjectURL(files[i]);
      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
    }
    setPreview(imageUrlLists);
  }, [files]);

  const deletePreview = (indexToDelete) => {
    setPreview(preview.filter((_, index) => index !== indexToDelete));
    deleteFile(indexToDelete);
  };

  return (
    <Container style={{maxWidth:"1040px"}}> 
      <div>
        <h1>미리보기</h1>
        {preview.map((image, index) => (
          <div key={index}>
            <img src={image} width={200} />
            <button onClick={() => deletePreview(index)}>삭제</button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default SnsImagePreview;
