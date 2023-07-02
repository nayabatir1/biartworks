import { useEffect } from "react";
import useStore from "../../store/UserStore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const token = useStore((state) => state.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/company-information");
    else navigate("/signin");
  }, [token, navigate]);

  return <></>;
};

export default Home;
