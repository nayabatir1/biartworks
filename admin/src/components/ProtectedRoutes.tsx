import { PropsWithChildren, useEffect } from "react";
import useStore from "../store/UserStore";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: PropsWithChildren) => {
  const token = useStore((state) => state.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/signin");
  }, [token, navigate]);

  return <>{children}</>;
};

export default ProtectedRoutes;
