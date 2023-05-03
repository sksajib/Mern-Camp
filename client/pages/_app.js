import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/nav";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/style.css" />
      </Head>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
