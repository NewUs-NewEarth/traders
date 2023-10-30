/**
 * @author heera youn
 * @create date 2023-10-25 13:59:36
 * @modify date 2023-10-30 15:42:13
 * @desc [그린페이 가입 인증 및 input FE]
 */
/**
 * @author ahrayi
 * 
 * @create date 2023-09-26 10:32:10
 * @modify date 2023-10-21 10:33:55
 * 그린페이 가입 - 1. 인증정보input 및 약관동의 처리
 */

import React, { useState } from "react";
import Terms from "./Terms";
import Form from "react-bootstrap/Form";
import { Grid, Container, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { CustomTextField } from "../../styles/styles";
import { Row } from "react-bootstrap";
import { Error } from "../util/Alert";

const RegisterStep1 = ({ form, onText, onNext }) => {
  const {
    userName,
    userInfo,
    userGender,
    cellCarrier,
    userCellNo,
    agreeYn,
    agreeDtime,
  } = form;

  const { control } = useForm({});

  const [termFlag, setTermFlag] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleTermsChange = (selectAllChecked) => {
    setTermFlag(selectAllChecked);
  };

  const handleNextClick = () => {
    console.log(form);
    if (
      userName === "" ||
      userInfo === "" ||
      userGender === "" ||
      cellCarrier === "" ||
      userCellNo === ""
    ) {
      alert("모든 항목을 작성해주세요.");
    } else {
      if (validateData()) {
        onNext();
      } else {
        Error("입력값이 올바르지 않습니다.");
      }
    }
  };

  function validateData() {
    const userNameRegex = /^[가-힣]{1,20}$/;
    const userInfoRegex = /^[0-9]{6}$/;
    const userGenderRegex = /^[0-9]{1}$/;
    const userCellNoRegex = /^[0-9]{11}$/;
    if (!userName.match(userNameRegex)) {
      return false;
    }
    
    if (!userInfo.match(userInfoRegex)) {
      return false;
    }

    if (!userGender.match(userGenderRegex)) {
      return false;
    }

    if (!userCellNo.match(userCellNoRegex)) {
      return false;
    }
    return true;
  }

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "180px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            style={{
              fontSize: "30px",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
            component="h1"
            variant="h5"
          >
            본인인증
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            variant="outlined"
            required
            id="userName"
            label="이름을 입력하세요"
            name="userName"
            value={userName}
            className="customTextField"
            autoComplete="fname"
            fullWidth
            bordercolor="green"
            autoFocus
            onChange={onText}
            inputProps={{ maxLength: 20, pattern: "^[가-힣]{1,20}$" }}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <CustomTextField
                variant="outlined"
                required
                id="userInfo"
                label="주민등록번호"
                name="userInfo"
                type="text"
                value={userInfo}
                maxLength={6}
                size={6}
                onChange={onText}
                bordercolor="green"
                inputProps={{ maxLength: 6, pattern: "^[0-9]{6}$" }}
              />
              
            </Grid>
            <text style={{ fontSize: "36px", verticalAlign: "middle" }}>
              &nbsp;&nbsp;-&nbsp;&nbsp;
            </text>
            <Grid item xs={2}>
              <CustomTextField
                variant="outlined"
                required
                fullWidth
                type="password"
                name="userGender"
                bordercolor="green"
                lable="성별*"
                value={userGender}
                maxLength={1}
                size={1}
                onChange={onText}
                inputProps={{ maxLength: 1, pattern: "^[0-9]{1}$" }}
              />
            </Grid>
            <text style={{ fontSize: "36px", verticalAlign: "middle" }}>
              ******
            </text>
          </Grid>
        </Grid>
        <br />

        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Form.Select
                label="통신사"
                name="cellCarrier"
                value={cellCarrier}
                onChange={onText}
                required
                style={{ height: "61px", width: "120px" }}
                className="basefont"
              >
                <option>통신사</option>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LG U+">LG U+</option>
                <option value="SKT 알뜰폰">SKT 알뜰폰</option>
                <option value="KT 알뜰폰">KT 알뜰폰</option>
                <option value="LG U+ 알뜰폰">LG U+ 알뜰폰</option>
              </Form.Select>
            </Grid>

            <Grid item xs={8}>
              <CustomTextField
                variant="outlined"
                fullWidth
                required
                type="text"
                name="userCellNo"
                bordercolor="green"
                value={userCellNo}
                label="휴대폰 번호를 입력하세요"
                onChange={onText}
                inputProps={{ maxLength: 11, pattern: "^[0-9]{11}$" }}
              />
            </Grid>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
      </Grid>

      <Terms
        onTermsChange={handleTermsChange}
        selectAllChecked={selectAllChecked}
        setSelectAllChecked={setSelectAllChecked}
      />
      <br />
      <br />
      <Row>
        <button
          onClick={handleNextClick}
          className="saveButton"
          disabled={!selectAllChecked}
          style={{ margin: "auto" }}
        >
          다음
        </button>
      </Row>
    </Container>
  );
};
export default RegisterStep1;
