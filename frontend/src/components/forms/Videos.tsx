import React, { useState } from "react";
import { Inputs } from "../../components/common/Inputs";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { ButtonCreative, UploadButton } from "../../components/common/Button";
import {
  FacebookVideosPost,
  InstaPostVideo,
  postCaptionsGenerate,
} from "../../redux/actions/actions";
import Swal from "sweetalert2";
const Videos = () => {
  const [file, setfile] = useState({ name: "" });
  const [caption, setCaption] = useState<string>("");
  const dispatch = useDispatch<any>();
  const { selectPage } = useSelector((state: any) => state.Post);

  const onFinishFB = async () => {
    let captionsss = await postCaptionsGenerate({ caption });
    const originalCaption = captionsss.caption.replace(/[^\w\s]/gi, "");
    if (selectPage) {
      const value = { caption: originalCaption, file, ...selectPage };
      await dispatch(FacebookVideosPost(value));
      await dispatch(InstaPostVideo(value));
      await Swal.fire("Post!", "Your Video Post SuccussFully!", "success");
      setfile({ name: "" });
      setCaption("");
    } else {
      alert("Please Select Page");
    }
  };

  return (
    <>
      <Card
        hoverable
        title="Post Videos"
        bordered={false}
        className="card-gradientFB col-4 px-3 pb-4"
      >
        <div>
          <UploadButton
            className="col-12 m-3"
            name="Video"
            onChange={(e: any) => setfile(e.target.files[0])}
          />
          <span className="fileName">{file.name}</span>
          <Inputs
            class="col-12"
            holder="Caption Videos"
            value={caption || ""}
            change={(e: any) => setCaption(e.target.value)}
            nam="caption"
            typs="text"
          />
          <div className="d-block w-100">
            <ButtonCreative type="button" onClick={onFinishFB}>
              Upload Video
            </ButtonCreative>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Videos;
