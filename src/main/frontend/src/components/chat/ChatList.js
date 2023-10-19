/**
 * @author hyunseul
 * @create date 2023-10-11 19:03:18
 * @modify date 2023-10-19 01:03:56
 */

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { BsChatDots } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useHistory, withRouter } from "react-router-dom";
import "../../assets/css/ChatListModal.css";
import "../../assets/css/ChatStyle.css";
import Chatprofile from "../../assets/img/Chatprofile.png";
import { fetchLastMessages } from "./fetchLastMessages ";

const ChatList = (props) => {
  // const { location } = props;
  // const username = location.state;
  // console.log(username.enteredUsername)
  // const [username,setUsername] = useState('');

  // const location = useLocation();
  // // const username =;
  // const [chatRooms, setChatRooms] = useState([]);
  // const history = useHistory();
  // const [dataLoaded, setDataLoaded] =useState(false);
  // const [lastMsg,setLastMsg] = useState([]);

  const [chatRooms, setChatRooms] = useState([]);
  const history = useHistory();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastMsg, setLastMsg] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  ///////////////////////////////
  const username = "배수지";
  ////////////////////////////////

  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (username) {
      fetchData().then(() => {
        setDataLoaded(true);
      });
    } else {
      history.push("/");
    }
  }, [username, history]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/chat/list", {
        params: {
          sender: username,
        },
      });

      const chatData = response.data || [];
      setChatRooms(chatData);

      console.log("채팅방 요청 성공", chatData);

      if (chatData.length > 0) {
        fetchLastMessageForChatRooms(chatData);
      }
    } catch (error) {
      console.error("채팅방 목록을 불러오는 데 실패했습니다.", error);
    }
  };

  // const chatRoomslastMsg = chatRooms.splice(-1)[1].split()

  // 마지막 메세지 가져와서 리스트 업데이트
  const fetchLastMessageForChatRooms = async (chatRooms) => {
    if (!chatRooms || chatRooms.length === 0) {
      console.log("채팅방 목록이 비어있습니다.");
      return;
    }

    console.log("채팅방 목록: 111111111111111", chatRooms);
    const chatLastMessages = await Promise.all(
      chatRooms.map(async (roomNum) => {
        try {
          const lastMessage = await fetchLastMessages(roomNum);
          return { roomNum, lastMessage };
        } catch (error) {
          console.error(
            `채팅방 ${roomNum}의 마지막 메시지를 가져오는 데 실패했습니다.`
          );
          return { roomNum, lastMessage: null };
        }
      })
    );
    setLastMsg(chatLastMessages);
  };
  console.log(chatRooms[0]);

  const closeBtn = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <BsChatDots
        onClick={openModalHandler}
        className="chatListBtn"
        size="50px"
      />
      <Modal show={isOpen} onHide={closeBtn}>
        <Modal.Header>
          <Modal.Title className="w-100 title list-header">
            <IoCloseSharp
              style={{
                position: "relative",
                right: "20px",
                top: "13px",
                float: "right",
              }}
              onClick={closeBtn}
            />
            My Chatting List
          </Modal.Title>
        </Modal.Header>

        {username && dataLoaded && chatRooms.length > 0 && (
          <Modal.Body>
            {lastMsg.map((chatRoom) => (
              <Row key={chatRoom.roomNum} className="mb-3 Row">
                <Col xs={3} style={{ width: "20%" }}>
                  <img
                    src={Chatprofile}
                    alt="프로필 이미지"
                    className="list-content-img"
                  />
                </Col>
                <Col xs={9} className="list-content-msg">
                  <Row>
                    <Col
                      className="list-receiver"
                      onClick={() =>
                        history.push(`/chat/roomNum/${chatRoom.roomNum}`)
                      }
                    >
                      {chatRoom.lastMessage.receiver
                        ? chatRoom.lastMessage.receiver
                        : "사용자가 없습니다."}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {chatRoom.lastMessage.lastMessage
                        ? chatRoom.lastMessage.lastMessage
                        : "메시지가 없습니다."}
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </Modal.Body>
        )}
      </Modal>
    </>
  );
};

export default withRouter(ChatList);
