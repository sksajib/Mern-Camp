import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import { useContext, useEffect, useState } from "react";

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
          className="col-3 nav sticky-top bg-light text-dark justify-content-left "
          style={{ height: "75px" }}
        >
          <div>
            <img
              src="/images/Unite.png"
              alt="image"
              height={"60"}
              width={"60"}
            />
          </div>
        </nav>

        <nav
          className=" col-9 nav sticky-top bg-light text-dark justify-content-end "
          style={{ height: "75px" }}
        >
          <div>
            <Link href="/" className={`nav-link text-dark  ${isActive("/")}`}>
              <h2>Unite</h2>
            </Link>
          </div>
          {state === null && (
            <>
              <div>
                <Link
                  href="/login"
                  className={`nav-link text-dark ${isActive("/login")}`}
                >
                  <h2>Login</h2>
                </Link>
              </div>
              <div>
                <Link
                  href="/register"
                  className={`nav-link text-dark ${isActive("/register")}`}
                >
                  <h2>Register</h2>
                </Link>
              </div>
            </>
          )}
          {/* Example single danger button */}

          {state && state.token && (
            <>
              <div className=" dropdown" style={{}}>
                <a
                  role="button"
                  href="/user/dashboard"
                  className={`nav-link text-dark ${isActive(
                    "/user/dashboard"
                  )}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h2>{state && state.user && name}</h2>
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
                      <h3>Profile</h3>
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
                        <h2>Logout</h2>
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
