import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LogOutButton } from "../common/Button";

const TopNavbar = (props: any) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <Navbar
      sticky="top"
      expand="lg"
      data-bs-theme="light"
      className="bg-body-tertiary bg-light"
      style={{
        background: "rgb(0, 0, 0)",
        backgroundImage:
          "linear-gradient(180deg, rgba(0,0,0,0.3757878151260504) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container fluid>
        <Link className="text-decoration-none" to="/">
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="toggle-button"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ">
            {props.Navs.map((i: any, indx: number) => (
              <Link
                key={`${i.id}`}
                className="text-decoration-none text-dark mx-2"
                to={i.nav}
              >
                {i.titls}
              </Link>
            ))}
          </Nav>
          <LogOutButton onClick={logout}>Log-Out</LogOutButton>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default TopNavbar;
