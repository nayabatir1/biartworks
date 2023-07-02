import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import useStore from "../../store/UserStore";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPassword } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";

const defaultValues = {
  email: "",
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const token = useStore((state) => state.token);

  useEffect(() => {
    if (token) window.location.replace("/company-information");
  }, [token]);

  const { mutateAsync, isLoading } = useForgotPassword();

  const navigate = useNavigate();

  const submit = handleSubmit(async (data) => {
    await mutateAsync(data);

    navigate("/reset-password", { replace: true });
  });

  return (
    <div
      id="wrapper"
      className="d-flex justify-content-center align-items-center p-1"
    >
      <div>
        <div className="text-center">
          <img src="/logo.png" alt="logo" height="200" />
        </div>
        <div id="form" className="px-2 py-4 border rounded">
          <Form onSubmit={submit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" {...register("email")} />
              {!!errors.email && (
                <Form.Text className="small text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="mt-3 w-100"
              disabled={isLoading}
            >
              Submit
            </Button>
          </Form>
        </div>
        <p className="text-center">
          Back to
          <a href="/signin" className="ms-1">
            Signin
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
