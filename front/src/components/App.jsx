import React from "react";
import { Outlet } from "react-router-dom";
import { removeAuthToken } from "../services/auth";


export function App() {
  // removeAuthToken();
  return (
    <>
      <Outlet />
    </>
  );
}
