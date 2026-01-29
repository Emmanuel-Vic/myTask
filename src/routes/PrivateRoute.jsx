import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import Signin from "../pages/Signin";

const PrivateRoute = ({ children }) => {
  const { signed } = useContext(AuthContext);
  return signed ? children : <Signin />;
};

export default PrivateRoute;