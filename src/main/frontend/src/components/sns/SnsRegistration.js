/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-20 11:17:28
 * @modify date 2023-10-20 11:22:48
 * @desc [캠페인 리스트에서 인증하기를 누르면 캠페인에 해당되는 태그가 고정되어 들어가고,
 *       캠페인 메인페이지의 글쓰기를 누르면 자유롭게 태그를 넣을 수 있음]
 */
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import SnsImagePreview from "./SnsImagePreview";
import Container from 'react-bootstrap/Container';
import TokenRefresher from '../service/TokenRefresher';

const SnsRegistration = () => {
    const form = new FormData();

    const [data, setData] = useState({
        content: "",
        tags: "",
    });

    const location = useLocation();
    const { tags } = location?.state || {};
    console.log('태그: ' + tags);

    const [files, setFiles] = useState([]);

    // 데이터를 불러온 후에 form에 채우기 위해 useEffect 사용
    useEffect(() => {
        if (tags) {
            // tags가 있는 경우 데이터 설정
            setData({
                ...data,
                tags,
            });
        }
    }, [tags]);

    const changeInput = (evt) => {
        const { name, value, type } = evt.target;

        if (type === "file") {
            const selectedFiles = Array.from(evt.target.files);

            setFiles([...files, ...selectedFiles]);
        } else {
            setData({
                ...data,
                [name]: value,
            });
        }
    };

    const deleteFile = (indexToDelete) => {
        const updatedFiles = files.filter((_, index) => index !== indexToDelete);
        setFiles(updatedFiles);
    };

    const history = useHistory();

    const submitData = () => {
        files.forEach((file) => {
            form.append("files", file);
        });
        form.append(
            "data",
            new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        try {
            TokenRefresher
                .post("/sns/create", form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => console.log(res.data));
        } catch (error) {
            if (error.response) {
                const errorResponse = error.response.data;
                console.log(errorResponse);
            }
        }
        history.push("/");
    };

    const cancel = () => {
        history.push("/campaign");
    };

    return (
        <Container style={{ maxWidth: "1040px" }}>
            <div>
                <h1> SNS 등록 </h1>

                글
                <textarea
                    name="content"
                    value={data.content}
                    onChange={changeInput}
                    rows={10}
                />
                <br />

                <input type="text" name="tags" value={data.tags} onChange={changeInput} />
                <br />

                <label htmlFor="files">
                    <div
                        className="btn-upload"
                        style={{
                            border: "1px solid rgb(77,77,77)",
                            width: "150px",
                            height: "30px",
                            borderRadius: "10px",
                        }}
                    >
                        파일 업로드하기
                    </div>
                </label>
                <input
                    name="files"
                    id="files"
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={changeInput}
                    style={{ display: "none" }}
                />
                <SnsImagePreview files={files} deleteFile={deleteFile} />
                <br />
                <button onClick={submitData}>상품작성완료</button>
                <button onClick={cancel}>작성취소</button>
            </div>
        </Container>
    );
};

export default SnsRegistration;
