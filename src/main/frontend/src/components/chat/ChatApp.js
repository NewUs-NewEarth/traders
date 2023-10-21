/**
 * @author hyunseul
 * @create date 2023-10-17 16:29:57
 * @modify date 2023-10-17 16:29:59
 */

import React, {useState} from "react";
import {useHistory} from "react-router-dom";

const ChatApp = () => {
    // const [username, setUsername] = useState("") // 사용자 이름
    const history = useHistory();
    const [roomNum, setRoomNum] = useState(""); // 방 번호 상태
    const [username, setUsername] = useState("");

    // const enteredUsername = prompt("사용자 이름을 입력하세요");
    // const handleUsernameInput = () => {
    //   if(enteredUsername){
    //     // setUsername(enteredUsername)
    //     console.log(enteredUsername)
    //     // const path = '/chat/list'
    //     // history.push({pathname:`{path}`, state: {enteredUsername}})
    //   }else{
    //     alert("사용자 이름을 입력해야 채팅을 시작할 수 있습니다.")
    //   }

    // }
    const handleUsernameInput = () => {
        const enteredUsername = prompt("사용자 이름을 입력하세요");
        if (enteredUsername) {
            setUsername(enteredUsername);
            // 사용자 이름을 설정하고 chat/list 페이지로 이동
            history.push({
                pathname: "/chat/list",
                state: {enteredUsername}
            });
        } else {
            alert("사용자 이름을 입력해야 채팅을 시작할 수 있습니다.");
        }
    };


    //  const pathname =`/chat/list`


    const handleEnterRoomNum = () => {
        // 방 입장 로직 구현 후, 방 정보 업데이트
        // const enteredUsername = prompt("사용자 이름을 입력하세요");
        const enteredRoomNum = prompt("채팅방 번호를 입력하세요");
        setRoomNum(enteredRoomNum);

        // 방 입장 후 채팅창으로 이동
        history.push(`chat/roomNum/${enteredRoomNum}`);
        console.log(enteredRoomNum);
    };

    return (
        <div>
            <h2>채팅 애플리케이션</h2>
            <button onClick={handleEnterRoomNum}>방 입장</button>

            {/* <Link to={{pathname: this.state.pathname , state:{username:"enteredUsername"}}}></Link> */}
            <button onClick={handleUsernameInput}>사용자 이름 입력</button>


        </div>
    );
};

export default ChatApp;
