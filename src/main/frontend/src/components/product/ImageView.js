/**
 * @author wheesunglee
 * @create date 2023-10-17 00:06:52
 * @modify date 2023-10-17 11:18:23
 */

import { useEffect, useState } from "react";

const ImageView = ({ imageList }) => {
  const [main, setMain] = useState({});

  useEffect(() => {
    if (imageList && imageList.length > 0) {
      setMain(imageList[0]);
    }
  }, [imageList]);

  const onView = (index) => {
    setMain(imageList[index]);
  };

  return (
    <div style={{ marginLeft: "1.5rem" }}>
      {main && (
        <img
          src={main.filepath}
          style={{
            width: "400px",
            height: "300px",
            maxWidth: "400px",
            maxHeight: "300px",
            objectFit: "contain",
            backgroundColor: "#fff",
          }}
        />
      )}
      {imageList.map((image, index) => (
        <li
          className="justify-content-space-between"
          style={{ display: "inline-block" }}
          key={index}
          onClick={() => onView(index)}
        >
          <img
            src={image.filepath}
            style={{
              width: "80px",
              height: "60px",
              maxWidth: "80px",
              maxHeight: "60px",
              objectFit: "contain",
              backgroundColor: "#fff",
            }}
          />
        </li>
      ))}
    </div>
  );
};

export default ImageView;
