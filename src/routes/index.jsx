import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayouts";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Forgot from "../pages/Forgot";
import ResetPassword from "../pages/ResetPassword";

const RouteApp = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* rotas públicas */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* rotas privadas com layout */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default RouteApp;
