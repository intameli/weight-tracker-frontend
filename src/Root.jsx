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
          <NavLink to={"/"}>Home</NavLink>
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <>
              <NavLink to={"login"}>Login</NavLink>
              <NavLink to={"signup"}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
      <Outlet />
    </>
  );
}
