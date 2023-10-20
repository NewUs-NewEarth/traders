/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-20 11:17:03
 * @modify date 2023-10-20 11:23:25
 * @desc [snsManage의 하위항목]
 */
import React from 'react';
import Container from 'react-bootstrap/Container';

const SnsDetails = ({ selectedImage }) => {

  // const user = window.user;

  if (!selectedImage) {
      // 선택한 이미지가 없을 때
      return <div>No image selected</div>;
  }

  return (
    <Container style={{maxWidth:"1040px"}}> 
      <div className="details-container">
        <div className="text-details">
          <p>{selectedImage.content}</p>
          <p>Created Date: {selectedImage.createdDate}</p>
          <p>Tags: {selectedImage.tags}</p>
          <p>Author: {selectedImage.author.username}</p>
        </div>
        {selectedImage.images && selectedImage.images.map((image, index) => (
          <img
            key={index}
            src={image.filepath}
            alt={`Image ${index}`}
          />
        ))}
      </div>
    </Container>
  );
};

export default SnsDetails;
