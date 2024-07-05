import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import { pageList } from "../../redux/actions/actions";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { pageSave, setTwitterDeatail } from "../../redux/slice/PostingSlice";
import {
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/Firebase";

const AccessToken = () => {
  const [page, setPage] = useState<any>([]);
  const [pageID, setPageID] = useState("");
  const dispatch = useDispatch<any>();
  const handlesPages = async () => {
    const Pages = localStorage.getItem("pageList");
    setPage((Pages && JSON.parse(Pages)) || []);
  };

  const onFinish = (e: any) => {
    const Pagenam = e.target.value.PageName;
    setPageID(Pagenam);
    dispatch(pageSave(e.target.value));
  };
  useEffect(() => {
    handlesPages();
  }, []);
  const onPressTwitter = () => {
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then((res: any) => {
        dispatch(
          setTwitterDeatail({
            accessToken: res._tokenResponse.oauthAccessToken,
            tokenSecret: res._tokenResponse.oauthTokenSecret,
          })
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const onPressFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider)
      .then(async (response: any) => {
        await dispatch(pageList(response._tokenResponse));
        await handlesPages();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <Card
        hoverable
        title="Access Token Genrate"
        bordered={false}
        className="card-gradientFB col-3  px-3 pb-4"
      >
        <Row>
          <FormControl variant="standard" className="px-2 mb-5 mt-3">
            <InputLabel id="demo-simple-select-standard-label" className="px-3">
              Pages
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              onChange={onFinish}
              label="Pages"
              defaultValue={pageID || ""}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {page.map((i: any) => [
                <MenuItem value={i}>{i.PageName}</MenuItem>,
              ])}
            </Select>
          </FormControl>
          <span className="ButtonFacebookLogin">
            <button onClick={onPressFacebook}>Log in with Facebook</button>
          </span>
          <span className="ButtonFacebookLogin mt-4">
            <button onClick={onPressTwitter}>Log in with Twitter</button>
          </span>
        </Row>
      </Card>
    </>
  );
};

export default AccessToken;
