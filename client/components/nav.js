import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
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
  let name2 = "";
  let id;
  if (state && state.user) {
    name = String(state.user.name);
    const [first, ...last] = name.split(" ");
    name = first;

    if (name.length > 8) {
      name2 = name.slice(0, 8);
      name = name2;
    }
  }
  //console.log(window.location.pathname);
  useEffect(() => {
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
    id = state.user._id;
    const data = axios.post("/add-inactive-time", { id });
    setState(null);
    setCurrent(state);
    //console.log(current);
    router.push("/login");
  };

  return (
    <div className="container sticky-top ">
      <div className="row">
        <nav
          className=" col-12 nav sticky-top bg-light h5 text-dark justify-content-between "
          style={{ height: "63px" }}
        >
          <div>
            <Link href="/" className={`nav-link text-dark  ${isActive("/")}`}>
              <h5 className="pt-1">Home</h5>
            </Link>
          </div>
          {state === null && (
            <>
              <div>
                <Link
                  href="/login"
                  className={`nav-link text-dark ${isActive("/login")}`}
                >
                  <h5>Login</h5>
                </Link>
              </div>
              <div>
                <Link
                  href="/register"
                  className={`nav-link text-dark ${isActive("/register")}`}
                >
                  <h5>Register</h5>
                </Link>
              </div>
            </>
          )}
          {/* Example single danger button */}

          {state && state.token && (
            <>
              <div>
                <Link href="/user/message" className=" text-dark">
                  <Avatar src="/images/message.png" size={45} className="dp" />
                </Link>
              </div>

              <div className=" dropdown ">
                <a
                  role="button"
                  href="/user/dashboard"
                  className={`nav-link text-dark overflow-hidden  ${
                    isActive("/user/dashboard") ||
                    isActive("/user/profile/update") ||
                    isActive("/user/PeopleList/sentFriendRequest") ||
                    isActive("/user/PeopleList/receivedFriendRequest")
                  }`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h5 className="pt-1 ">
                    {state && state.user && name}
                    <CaretDownOutlined className="me-3" />
                  </h5>
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
                      role="button"
                      className={`nav-link text-dark ${isActive(
                        "/user/PeopleList/sentFriendRequest"
                      )}`}
                      href="/user/PeopleList/sentFriendRequest"
                      aria-expanded="false"
                    >
                      <h4>Request Sent</h4>
                    </a>
                  </li>
                  <li>
                    <a
                      role="button"
                      className={`nav-link text-dark ${isActive(
                        "/user/PeopleList/receivedFriendRequest"
                      )}`}
                      href="/user/PeopleList/receivedFriendRequest"
                      aria-expanded="false"
                    >
                      <h4>Friend Request</h4>
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
