import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import useStore from "../../store/UserStore";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPassword } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";

const defaultValues = {
  otp: "",
  password: "",
  confirmPassword: "",
};

const schema = yup.object().shape({
  otp: yup.string().trim().required("OTP is required"),
  password: yup.string().trim().required(),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Password don't match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutateAsync, isLoading } = useResetPassword();

  const token = useStore((state) => state.token);

  useEffect(() => {
    if (token) window.location.replace("/company-information");
  }, [token]);

  const navigate = useNavigate();

  const submit = handleSubmit(async (data) => {
    await mutateAsync(data);
    return navigate("/signin", { replace: true });
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
              <Form.Label>OTP</Form.Label>
              <Form.Control type="text" {...register("otp")} />
              {!!errors.otp && (
                <Form.Text className="small text-danger">
                  {errors.otp.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" {...register("password")} />
              {!!errors.password && (
                <Form.Text className="small text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" {...register("confirmPassword")} />
              {!!errors.confirmPassword && (
                <Form.Text className="small text-danger">
                  {errors.confirmPassword.message}
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
      </div>
    </div>
  );
};

export default ResetPassword;
