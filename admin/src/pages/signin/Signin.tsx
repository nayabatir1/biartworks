import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import "./index.css";
import { useSignin } from "../../hooks/auth.hooks";
import { SigninBody } from "../../shared/types";
import { useEffect } from "react";
import useStore from "../../store/UserStore";

const defaultValues = {
  email: "",
  password: "",
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Signin = () => {
  const { mutateAsync, isLoading } = useSignin();

  const token = useStore((state) => state.token);

  useEffect(() => {
    if (token) window.location.replace("/company-information");
  }, [token]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const submit = handleSubmit(async (data: SigninBody) => {
    await mutateAsync(data);
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

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" {...register("password")} />
              {!!errors.password && (
                <Form.Text className="small text-danger">
                  {errors.password.message}
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
          <a href="/forgot-password">Forgot password</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
