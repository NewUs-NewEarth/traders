/**
 * @author hyunseul
 * @create date 2023-10-17 16:30:10
 * @modify date 2023-10-17 16:30:16
 */

import React, {useEffect, useState} from 'react';
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import '../../assets/css/ChatMapModal.css';

const ChatMap = ({onAddressChange}) => {
    const {kakao} = window;
    const [userLocation, setUserLocation] = useState({lat: 0, lng: 0}); // 사용자의 현재 위치 정보를 저장할 상태
    const [markerPosition, setMarkerPosition] = useState({lat: 0, lng: 0}); // 마커의 위치를 저장할 상태
    const [address, setAddress] = useState('');


    // 사용자의 현재 위치를 얻어오는 함수
    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const {latitude, longitude} = position.coords;
                        setUserLocation({lat: latitude, lng: longitude});
                        setMarkerPosition({lat: latitude, lng: longitude});
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };
        getUserLocation(); // 사용자의 현재 위치를 얻어옴
    }, []); // 처음 렌더링될 때 한 번만 호출

    // 좌표로 주소를 가져오는 비동기 함수
    const getAddressFromCoordinates = async (lat, lng) => {
        const geocoder = new kakao.maps.services.Geocoder();
        const coord = new kakao.maps.LatLng(lat, lng);

        return new Promise((resolve, reject) => {
            geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // result[0].road_address 는 도로명 주소입니다.
                    resolve(result[0].road_address);
                } else {
                    reject(status);
                }
            });
        });
    };


    // 마커 드래그 이벤트 핸들러
    const handleMarkerDragEnd = (e) => {
        const newPosition = e.getPosition();
        const newLocation = {
            lat: newPosition.getLat(),
            lng: newPosition.getLng(),
        };
        setMarkerPosition(newLocation);

        // 드래그 끝난 위치의 주소를 가져와서 설정
        getAddressFromCoordinates(newLocation.lat, newLocation.lng)
            .then((result) => {
                onAddressChange(result.address_name);
            })
            .catch((error) => {
                console.error('Failed to get address:', error);
            });
    };

    return (
        <>
            <Map
                className='map'
                center={{lat: markerPosition.lat, lng: markerPosition.lng}}
                level={3}
            >
                <MapMarker position={{lat: markerPosition.lat, lng: markerPosition.lng}} draggable={true}
                           onDragEnd={handleMarkerDragEnd}/>


                {address && (
                    <div>
                        <p>{address}</p>
                    </div>
                )}
            </Map>
        </>
    );
};

export default ChatMap;
