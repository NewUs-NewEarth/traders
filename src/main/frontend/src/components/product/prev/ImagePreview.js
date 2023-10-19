/**
 * @author wheesunglee
 * @create date 2023-10-06 10:16:27
 * @modify date 2023-10-11 14:39:13
 */
import React, { useEffect, useState } from "react";

const ImagePreview = ({ files, deleteFile }) => {
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
    <div>
      <h1>미리보기</h1>
      {preview.map((image, index) => (
        <div key={index}>
          <img src={image} width={200} />
          <button onClick={() => deletePreview(index)}>삭제</button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
