import React, { useState } from "react";
import { Inputs } from "../common/Inputs";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { ButtonCreative } from "../common/Button";
import { setSchedule } from "../../redux/slice/PostingSlice";
const Photots = () => {
  const dispatch = useDispatch<any>();
  const { selectPage } = useSelector((state: any) => state.Post);
  const [prompt, setprompt] = useState<string>("");
  const onFinishFB = async () => {
    if (selectPage) {
      await dispatch(setSchedule({ prompt, ...selectPage }));
      setprompt("");
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
        className="card-gradientFB col-4 px-3 pb-4"
      >
        <div>
          <Inputs
            class="col-12"
            holder="Which Type Post"
            value={prompt || ""}
            change={(e: any) => setprompt(e.target.value)}
            nam="prompt"
            typs="text"
          />
          <div className="d-block w-100 mt-5">
            <ButtonCreative onClick={onFinishFB} type="button">
              Start Scheduler
            </ButtonCreative>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Photots;
