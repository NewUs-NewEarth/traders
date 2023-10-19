/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-09-26 10:33:01
 * @modify date 2023-10-17 11:37:16
 * @desc [상품 리스트 페이지에서 근처 상품 보기 버튼을 클릭하면 지도 모달 페이지가 뜨게 한다.]
 */
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const ModalPage = ({ lat, lng }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showModal && (
        <Map
          className="myMap"
          style={{
            width: "400px",
            height: "300px",
            position: "relative",
            marginLeft: "1.5rem",
          }}
          center={{ lat: lat, lng: lng }}
          level={3}
          draggable={false}
        >
          <MapMarker position={{ lat: lat, lng: lng }}></MapMarker>
        </Map>
      )}
    </>
  );
};

export default ModalPage;
