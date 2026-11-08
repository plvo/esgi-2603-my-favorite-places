import { Navigate, Routes, Route } from "react-router";
import { HomePage } from "./pages/Home";
import { useEffect, useState } from "react";
import axios from "axios";
import { SigninPage } from "./pages/Signin";
import { SignupPage } from "./pages/Signup";
import { DashboardPage } from "./pages/Dashboard";

function guard(
  component: React.ReactNode,
  shouldBeConnected: boolean,
  redirectTo: string = "/",
) {
  if (!!sessionStorage.getItem("user") === shouldBeConnected) {
    return component;
  } else {
    return <Navigate to={redirectTo} replace />;
  }
}

export function Router() {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    async function getUser() {
      const { data } = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data?.item?.id) {
        sessionStorage.setItem("user", data?.item);
      }

      setReady(true);
    }
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    }
  }, []);

  if (ready) {
    return (
      <Routes>
        <Route path="/" element={guard(<HomePage />, false, "/dashboard")} />
        <Route
          path="/signin"
          element={guard(<SigninPage />, false, "/dashboard")}
        />
        <Route
          path="/signup"
          element={guard(<SignupPage />, false, "/dashboard")}
        />
        <Route path="/dashboard" element={guard(<DashboardPage />, true)} />
      </Routes>
    );
  } else {
    return <p>Loading...</p>;
  }
}
