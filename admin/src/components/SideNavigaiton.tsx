import { PropsWithChildren, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faBars,
  faBuilding,
  faUserGroup,
  faUser,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";

type Title = Record<string, string>;

const title: Title = {
  "/company-information": "company information",
  "/user-groups": "user groups",
  "/reports": "reports",
  "/users": "users",
};

type Menu = Record<
  string,
  { title: string; icon: IconDefinition; description: string }
>;

const menu: Menu = {
  "/company-information": {
    title: "company information",
    description: "Company details",
    icon: faBuilding,
  },
  "/user-groups": {
    title: "user groups",
    description: "User groups information",
    icon: faUserGroup,
  },
  "/reports": {
    title: "reports",
    description: "Defects log",
    icon: faChartColumn,
  },
  "/users": {
    title: "users",
    description: "Users details",
    icon: faUser,
  },
};

const SideNavigaiton = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const baseParam = "/" + pathname.split("/")[1];

  const navigate = useNavigate();

  const toggle = () => setOpen((p) => !p);

  return (
    <Container fluid>
      <Row className="border">
        <Col className="top-bar d-flex align-items-center">
          <FontAwesomeIcon
            icon={faBars}
            className="border rounded p-1"
            onClick={toggle}
          />
          <span className="ms-2 text-capitalize">{title[baseParam]}</span>
        </Col>
      </Row>
      <Row className="main-content">
        <Col
          className={`border-end p-0 pt-5 d-md-block ${
            open ? "d-block" : "d-none"
          }`}
          md={3}
        >
          <div className="w-100 border-bottom logo">
            <div className="text-center">
              <img src="/logo.png" alt="logo" width="100%" />
              <p className="fw-bold text-uppercase font-monospace">
                qualitygram
              </p>
            </div>
          </div>
          <div className="mt-3 menu">
            {Object.keys(menu).map((i) => (
              <div
                key={i}
                className={`p-2 d-flex align-items-center ${
                  baseParam === i
                    ? "active border-primary border-bottom  border-top"
                    : ""
                }`}
                onClick={() => navigate(i)}
              >
                <FontAwesomeIcon icon={menu[i].icon} size="lg" />
                <div className="d-flex flex-column ms-2">
                  <p className="text-capitalize m-0">{menu[i].title}</p>
                  <p className="text-capitalize m-0 text-small">
                    {menu[i].description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col md={9} className={`${open ? "d-none" : "d-block"} d-md-block`}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default SideNavigaiton;
