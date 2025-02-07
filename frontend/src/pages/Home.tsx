import React, { Fragment, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AccessToken from "../components/forms/AccessToken";
import Photots from "../components/forms/Photots";
import Videos from "../components/forms/Videos";
import TopNavbar from "../components/header/TopNavbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/home");
    }
  }, []);
  return (
    <Fragment>
      <TopNavbar Navs={[{ id: 1, titls: "Dashboard", nav: "/home" }]} />
      <div className="marginCenter">
        <Container>
          <Row className="justify-content-between g-4">
            <Col md={4} className="d-flex">
              <AccessToken />
            </Col>
            <Col md={4} className="d-flex">
              <Photots />
            </Col>
            <Col md={4} className="d-flex">
              <Videos />
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default Home;
