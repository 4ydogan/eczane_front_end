import "../styles/globals.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "bootstrap/dist/css/bootstrap.min.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import Login from "./login";
import Register from "./register";

// axios.defaults.baseURL = "http://10.3.131.22:8080";
axios.defaults.baseURL = "http://127.0.0.1:8080";

export default function App({ Component, pageProps }: AppProps) {
  const router: NextRouter = useRouter();

  const [user_id, setUserID] = useState<undefined | null | string>(null);
  const [yetki, setYetki] = useState<undefined | null | string>(null);
  axios.defaults.headers.common["user_id"] = user_id;
  axios.defaults.headers.common["yetki"] = yetki;

  useEffect(() => {
    setUserID(localStorage.getItem("user_id"));
    setYetki(localStorage.getItem("yetki"));
    axios.defaults.headers.common["user_id"] = user_id;
    axios.defaults.headers.common["yetki"] = yetki;

    setTimeout(() => {
      if (router.pathname !== ("/login" && "/register") && user_id === null)
        router.push("/login");
    }, 1000);
  }, [router.pathname]);

  return (
    <>
      {user_id === null ? (
        router.pathname === "/login" ? (
          <Login />
        ) : (
          <Register />
        )
      ) : (
        <div>
          <Row className="bg-light border">
            <NavBar />
          </Row>
          <div className="main-div">
            <Row className="bg-light border">
              <Component {...pageProps} />
            </Row>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <Row>
          <Col className="bg-light border" xs="2">
            <NavBar />
          </Col>
          <Col className="bg-light border" xs="10">
            <Component {...pageProps} />
          </Col>
        </Row> */
}
