import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import { ButtonFacebookLogin } from "../common/Button";
import { pageList } from "../../redux/actions/actions";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { pageSave } from "../../redux/slice/PostingSlice";

const AccessToken = () => {
  const [page, setPage] = useState<any>([]);
  const [pageID, setPageID] = useState("");
  const dispatch = useDispatch<any>();
  const handlesPages = async () => {
    const Pages = localStorage.getItem("pageList");
    setPage(Pages ? JSON.parse(Pages) : []);
  };
  const handleSuccess = async (response: any) => {
    await dispatch(pageList(response.authResponse));
    await handlesPages();
  };
  const onFinish = (e: any) => {
    const Pagenam = e.target.value.PageName;
    setPageID(Pagenam);
    dispatch(pageSave(e.target.value));
  };
  useEffect(() => {
    handlesPages();
  }, []);

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
            <ButtonFacebookLogin handleSuccess={handleSuccess} />
          </span>
        </Row>
      </Card>
    </>
  );
};

export default AccessToken;
