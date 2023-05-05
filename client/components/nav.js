import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import { useContext } from "react";
const Nav = () => {
  const router = useRouter();

  const isActive = (href) => {
    return router.pathname === href ? "active" : "";
  };
  const [state, setState] = useContext(UserContext);
  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };
  return (
    <nav
      className="nav sticky-top justify-content-center container"
      style={{ backgroundColor: "black", height: "75px", width: "100%" }}
    >
      <div>
        <img
          src="/images/Purba2.jpeg"
          alt="image"
          height={"40"}
          width={"50"}
          className=" img2"
        />
      </div>
      <div>
        <Link href="/" className="nav-link  text-light ">
          <h2>Purba</h2>
        </Link>
      </div>
      <div>
        <Link href="/" className={`nav-link text-light ${isActive("/")}`}>
          <h2>Unite</h2>
        </Link>
      </div>
      {state === null && (
        <>
          <div>
            <Link
              href="/login"
              className={`nav-link text-light ${isActive("/login")}`}
            >
              <h2>Login</h2>
            </Link>
          </div>
          <div>
            <Link
              href="/register"
              className={`nav-link text-light ${isActive("/register")}`}
            >
              <h2>Register</h2>
            </Link>
          </div>
        </>
      )}
      {state !== null && (
        <div className="nav-link text-light">
          <a onClick={logout}>
            <h2>Logout</h2>
          </a>
        </div>
      )}
    </nav>
  );
};
export default Nav;
