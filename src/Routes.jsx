import { useState, useContext } from "react";
import Root from "./Root.jsx";
import App from "./App.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserContext } from "./userContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "login",
        element: <ProtectedRoutes component={<Login />} />,
      },
      {
        path: "signup",
        element: <ProtectedRoutes component={<SignUp />} />,
      },
    ],
  },
]);

export function Routes() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });
  console.log(user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

function ProtectedRoutes({ component }) {
  const { user } = useContext(UserContext);
  const render = user ? <Navigate to="/" /> : component;
  return render;
}
function RootWrapper() {
  const { user } = useContext(UserContext);
  return <Root key={user} />;
}
