import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => navigate("/", { replace: true });

  return (
    <Container>
      <Row className="fullHeight align-items-center">
        <Col xs={12}>
          <h3 className="text-center error">404</h3>
          <p className="text-center">
            Ooops!!! The page you are looking for is not found
          </p>
          <div className="text-center">
            <Button
              variant="outline-secondary text-uppercase"
              onClick={goToHome}
            >
              back to home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
