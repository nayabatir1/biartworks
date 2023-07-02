import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import SideNavigaiton from "../../components/SideNavigaiton";
import { useEffect } from "react";
import {
  useGetCompanyDetails,
  useUpdateCompanyDetails,
} from "../../hooks/company.hooks";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faLanguage,
  faLocation,
  faLocationArrow,
  faLocationDot,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const defaultValues = {
  name: "",
  address: "",
  phone: "",
  employeeCount: "",
  location: "",
  zip: "",
  language: "",
};

const schema = yup.object({
  name: yup.string().trim(),
  address: yup.string().trim(),
  phone: yup.string().trim(),
  employeeCount: yup.string().trim(),
  location: yup.string().trim(),
  zip: yup.string().trim(),
  language: yup.string().trim(),
});

const CompanyInformation = () => {
  const { data } = useGetCompanyDetails();

  const { mutateAsync, isLoading } = useUpdateCompanyDetails();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (data) {
      reset(data.data);
    }
  }, [data, reset]);

  const submit = handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <SideNavigaiton>
      <Container>
        <Row>
          <p className="h2 text-uppercase">company information</p>
        </Row>
        <Form onSubmit={submit}>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group className="mb-3" controlId="companyName">
                <Form.Label>Company name</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    className="border-0 rounded-0 border-bottom"
                    {...register("name")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faBuilding} />
                  </InputGroup.Text>
                </InputGroup>
                {!!errors.name && (
                  <Form.Text className="small text-danger">
                    {errors.name.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="billingAddress">
                <Form.Label>Billing address</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter billing address"
                    className="border-0 rounded-0 border-bottom"
                    {...register("address")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </InputGroup.Text>
                </InputGroup>
                {!!errors.address && (
                  <Form.Text className="small text-danger">
                    {errors.address.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="Phone">
                <Form.Label>Phone</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone"
                    className="border-0 rounded-0 border-bottom"
                    {...register("phone")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faPhone} />
                  </InputGroup.Text>
                </InputGroup>

                {!!errors.phone && (
                  <Form.Text className="small text-danger">
                    {errors.phone.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="noOfEmployees">
                <Form.Label>Number of employees</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter number of employees"
                    className="border-0 rounded-0 border-bottom"
                    {...register("employeeCount")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faUser} />
                  </InputGroup.Text>
                </InputGroup>
                {!!errors.employeeCount && (
                  <Form.Text className="small text-danger">
                    {errors.employeeCount.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="location">
                <Form.Label>Location</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter location"
                    className="border-0 rounded-0 border-bottom"
                    {...register("location")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faLocation} />
                  </InputGroup.Text>
                </InputGroup>
                {!!errors.location && (
                  <Form.Text className="small text-danger">
                    {errors.location.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="zipcode">
                <Form.Label>Zip code</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter zip code"
                    className="border-0 rounded-0 border-bottom"
                    {...register("zip")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </InputGroup.Text>
                </InputGroup>
                {!!errors.zip && (
                  <Form.Text className="small text-danger">
                    {errors.zip.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="language">
                <Form.Label>Language</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter langugage"
                    className="border-0 rounded-0 border-bottom"
                    {...register("language")}
                  />
                  <InputGroup.Text className="border-0 bg-white border-bottom">
                    <FontAwesomeIcon icon={faLanguage} />
                  </InputGroup.Text>
                </InputGroup>
                {!!errors.language && (
                  <Form.Text className="small text-danger">
                    {errors.language.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Button type="submit" variant="primary" disabled={isLoading}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </SideNavigaiton>
  );
};

export default CompanyInformation;
