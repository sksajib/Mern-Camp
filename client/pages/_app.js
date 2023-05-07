import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/nav";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../public/css/style.css";
import { UserProvider } from "../context";
import UserRoute from "../components/routes/UserRoute";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link rel="stylesheet" href="/css/style.css" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/images/Unite.ico"
        />
        <title>Welcome to Unite</title>
      </Head>
      <Nav />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Component {...pageProps} />
    </UserProvider>
  );
}
export default MyApp;
