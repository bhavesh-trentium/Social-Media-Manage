import React from "react";
import { Card, Form, Input } from "antd";
import { CiLock, CiUser } from "react-icons/ci";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { ButtonCreative } from "../common/Button";
export interface userItem {
  email: string;
  password: string;
}
const SignIn = () => {
  const navigate = useNavigate();
  const onFinish = (values: userItem) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        localStorage.setItem("user", JSON.stringify(userCredential.user.email));
        navigate("/home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card
      hoverable
      title="Login Form"
      bordered={false}
      className="card-formLogin card-gradientFB"
    >
      <Form
        name="signin-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name={"email"}
          rules={[
            {
              required: true,
              message: "Please input your Email!",
              type: "email",
            },
          ]}
        >
          <Input prefix={<CiUser />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<CiLock />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <ButtonCreative type="submit">Sign-In</ButtonCreative>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignIn;
