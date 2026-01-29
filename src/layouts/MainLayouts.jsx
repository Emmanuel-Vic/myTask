// src/layouts/MainLayout.jsx
import Navizinha from "../components/Navizinha";
import Roda from "../components/Roda";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navizinha />
      <div>
        <Outlet />
      </div>
      <Roda />
    </>
  );
};

export default MainLayout;