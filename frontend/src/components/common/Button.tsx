import React from "react";
import "./index.css";
import { CloudUploadOutlined } from "@ant-design/icons";
import { FacebookProvider, LoginButton } from "react-facebook";
import { Input } from "antd";
import { ButtonCreativeProps } from "./common.props";

export const ButtonCreative: React.FC<ButtonCreativeProps> = ({
  children,
  ...rest
}) => {
  return (
    <button className="creative mt-2" {...rest}>
      {children}
    </button>
  );
};
export const UploadButton = (props: any) => {
  return (
    <>
      <div className={`input-div ${props.class}`}>
        <Input
          name={props.name}
          className="input"
          onChange={props.onChange}
          type="file"
        />
        <span style={{ fontSize: "2rem" }} className="fileName">
          <CloudUploadOutlined />
        </span>
      </div>
    </>
  );
};

export const ButtonFacebookLogin = (props: any) => {
  return (
    <>
      <FacebookProvider appId={"184681667978801"}>
        <LoginButton
          scope="email,business_management"
          onSuccess={props.handleSuccess}
          onError={(err) => console.log(err)}
        >
          Log in with Facebook
        </LoginButton>
      </FacebookProvider>
    </>
  );
};

export const LogOutButton: React.FC<ButtonCreativeProps> = ({
  children,
  ...rest
}) => {
  return (
    <button className="Btn" {...rest}>
      <div className="sign">
        <svg viewBox="0 0 512 512">
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
        </svg>
      </div>

      <div className="text">{children}</div>
    </button>
  );
};
