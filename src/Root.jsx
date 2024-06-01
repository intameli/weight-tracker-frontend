import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { UserContext } from "./context/userContext";

export default function Root() {
  const { user, setUser } = useContext(UserContext);

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <>
      <div className="header">
        <h1 className="title">Weight Tracker</h1>
        <nav className="nav">
          <NavLink className="navBtn" to={"/"}>
            Home
          </NavLink>
          {user ? (
            <button className="navBtn" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink className="navBtn" to={"login"}>
                Login
              </NavLink>
              <NavLink className="navBtn" to={"signup"}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
      <Outlet />
    </>
  );
}
