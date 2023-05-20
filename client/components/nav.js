import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import { useContext, useEffect, useState } from "react";
import {
  MessageOutlined,
  MessageTwoTone,
  CaretLeftOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
const Nav = () => {
  const [state, setState] = useContext(UserContext);
  const [current, setCurrent] = useState(state);
  const router = useRouter();
  ///const channel = new BroadcastChannel("my-channel");
  let name = "";
  if (state && state.user) {
    name = String(state.user.name);
    const [first, ...last] = name.split(" ");
    name = first;
  }
  //console.log(window.location.pathname);
  useEffect(() => {
    console.log("Current =>", router.pathname);
    //console.log(state);
    //setCurrent(state);
    // console.log(current);
    const event = new Event("stateUpdate");
    window.dispatchEvent(event);
  }, [router.pathname]);

  useEffect(() => {
    const handleStateUpdate = () => {
      setState(JSON.parse(window.localStorage.getItem("auth")));
    };
    window.addEventListener("stateUpdate", handleStateUpdate);
    return () => {
      window.removeEventListener("stateUpdate", handleStateUpdate);
    };
  }, []);

  const isActive = (href) => {
    return router.pathname === href ? "active" : "";
  };

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    setCurrent(state);
    //console.log(current);
    router.push("/login");
  };

  return (
    <div className="container sticky-top">
      <div className="row">
        <nav
          className=" col-12 nav sticky-top bg-light text-dark justify-content-between "
          style={{ height: "73px" }}
        >
          <div>
            <Link href="/" className={`nav-link text-dark  ${isActive("/")}`}>
              <h3 className="pt-1">Home</h3>
            </Link>
          </div>
          {state === null && (
            <>
              <div>
                <Link
                  href="/login"
                  className={`nav-link text-dark ${isActive("/login")}`}
                >
                  <h3>Login</h3>
                </Link>
              </div>
              <div>
                <Link
                  href="/register"
                  className={`nav-link text-dark ${isActive("/register")}`}
                >
                  <h3>Register</h3>
                </Link>
              </div>
            </>
          )}
          {/* Example single danger button */}

          {state && state.token && (
            <>
              <div>
                <Link href="/" className=" text-dark">
                  <Avatar src="/images/message.png" size={72} className="dp" />
                </Link>
              </div>

              <div className=" dropdown">
                <a
                  role="button"
                  href="/user/dashboard"
                  className={`nav-link text-dark  ${
                    isActive("/user/dashboard") ||
                    isActive("/user/profile/update")
                  }`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h3 className="pt-1">
                    {state && state.user && name}
                    <CaretDownOutlined className="me-3" />
                  </h3>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  style={{ overflow: "hidden" }}
                >
                  <li>
                    <a
                      role="button"
                      className={`nav-link text-dark ${isActive(
                        "/user/dashboard"
                      )}`}
                      href="/user/dashboard"
                      aria-expanded="false"
                    >
                      <h4>Profile</h4>
                    </a>
                  </li>
                  <li>
                    <a
                      className={`nav-link text-dark ${isActive(
                        "/user/profile/update"
                      )}`}
                      href="/user/profile/update"
                    >
                      <h4>Update Profile</h4>
                    </a>
                  </li>
                  <li>
                    <a
                      className={`nav-link text-dark ${isActive("#")}`}
                      href="#"
                    >
                      <h2>About</h2>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <div className="nav-link text-dark">
                      <a onClick={logout}>
                        <h4>Logout</h4>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
export default Nav;
