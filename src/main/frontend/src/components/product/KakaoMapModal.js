/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-04 13:01:44
 * @modify date 2023-10-20 21:11:08
 * @desc [거래 장소 선택 모달(처음에는 현위치, 마커 이동해서 선택), ProcuctRegistaration의 하위 컴포넌트]
 */

// import { Button, Modal } from "antd";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import React, {useEffect, useState} from "react";
import {Map, MapMarker} from "react-kakao-maps-sdk"; // Import MapMarker instead of Marker

const KakaoMapModal = ({onMapSubmit}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        lat: 0.0,
        lng: 0.0,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setCurrentLocation({lat, lng});
            });
        }
    }, []);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleMarkerDragEnd = (e) => {
        const newPosition = e.getPosition();
        const newLocation = {
            lat: newPosition.getLat(),
            lng: newPosition.getLng(),
        };
        setCurrentLocation(newLocation);
    };

    const handleSubmit = () => {
        onMapSubmit(currentLocation);
        closeModal();
    };

    return (
        <div>
            <Button onClick={openModal}>거래 장소 선택</Button>
            <Modal
                title="거래 장소 선택"
                visible={modalVisible}
                onOk={handleSubmit}
                onCancel={closeModal}
            >
                <Map
                    style={{width: "100%", height: "400px"}}
                    center={currentLocation}
                >
                    <MapMarker
                        position={currentLocation}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                    />
                </Map>
            </Modal>
        </div>
    );
};

export default KakaoMapModal;
