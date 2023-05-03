import Link from "next/link";
const Nav = () => {
  return (
    <nav className="nav bg-dark d-flex  sticky-top justify-content-center container">
      <Link href="/" legacyBehavior>
        <a className="nav-link text-light">
          <h2>Home</h2>
        </a>
      </Link>
      <Link href="/login" legacyBehavior>
        <a className="nav-link text-light">
          <h2>Login</h2>
        </a>
      </Link>
      <Link href="/register" legacyBehavior>
        <a className="nav-link text-light">
          <h2>Register</h2>
        </a>
      </Link>
    </nav>
  );
};
export default Nav;
