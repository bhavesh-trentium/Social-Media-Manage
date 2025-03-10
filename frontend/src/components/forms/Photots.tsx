import React, { useState } from "react";
import { Inputs } from "../common/Inputs";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { ButtonCreative } from "../common/Button";
import { setPageDeatail } from "../../redux/slice/PostingSlice";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Row } from "react-bootstrap";

const Photots = () => {
  const dispatch = useDispatch<any>();
  const { selectPage, postCategory } = useSelector((state: any) => state.Post);
  const [promptcaption, setPromptcaption] = useState<string>("");
  const [promptimage, setPromptimage] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const onFinishFB = async () => {
    if (selectPage) {
      await dispatch(
        setPageDeatail({ promptcaption, promptimage, ...selectPage, category })
      );
      setPromptcaption("");
      setPromptimage("");
    } else {
      alert("Please Select Page");
    }
  };
  return (
    <>
      <Card
        hoverable
        title="Post Images"
        bordered={false}
        className="card-gradientFB h-100 w-100"
      >
        <Row>
          <Inputs
            class="col-12"
            holder="Prompt Your for caption"
            value={promptcaption || ""}
            change={(e: any) => setPromptcaption(e.target.value)}
            nam="promptcaption"
            typs="text"
          />
          <Inputs
            class="col-12"
            holder="Prompt Your for Image"
            value={promptimage || ""}
            change={(e: any) => setPromptimage(e.target.value)}
            nam="promptimage"
            typs="text"
          />
          {/* <FormControl variant="standard" className="mb-1 mt-3">
            <InputLabel id="demo-simple-select-standard-label" className="px-2">Post Category</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              onChange={(e) => setCategory(e.target.value)}
              label="Pages"
              defaultValue={""}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {postCategory && postCategory.map((i: any) => [
                <MenuItem value={i}>{i}</MenuItem>,
              ])}
            </Select>
          </FormControl> */}
          <div className="d-block w-100">
            <ButtonCreative onClick={onFinishFB} type="button">
              Start Scheduler
            </ButtonCreative>
          </div>
        </Row>
      </Card>
    </>
  );
};

export default Photots;
