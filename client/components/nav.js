import Link from "next/link";
import { useRouter } from "next/router";
const Nav = () => {
  const router = useRouter();

  const isActive = (href) => {
    return router.pathname === href ? "active" : "";
  };
  return (
    <nav
      className="nav d-flex sticky-top justify-content-center container"
      style={{ backgroundColor: "black", height: "75px", width: "100%" }}
    >
      <div>
        <Link href="/" className="nav-link text-light navbar navbar-brand ">
          <img
            src="/images/Purba2.jpeg"
            alt="image"
            height={"40"}
            width={"50"}
            className="d-inline-block img2"
          />
          <h2>Purba</h2>
        </Link>
      </div>
      <div>
        <Link href="/" className={`nav-link text-light ${isActive("/")}`}>
          <h2>Unite</h2>
        </Link>
      </div>
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
    </nav>
  );
};
export default Nav;
