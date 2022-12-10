import '../styles/globals.css'
import "primereact/resources/themes/lara-light-indigo/theme.css" //theme
import "primereact/resources/primereact.min.css" //core css
import "primeicons/primeicons.css" //icons
import "bootstrap/dist/css/bootstrap.min.css";

import type { AppProps } from 'next/app'
import NavBar from '../components/NavBar'
import { Col, Container, Row } from 'reactstrap'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Row>
        <Col className="bg-light border" xs='2'>
          <NavBar />
        </Col>
        <Col className="bg-light border" xs='10'>
          <Component {...pageProps} />
        </Col>
      </Row>

    </>
  )

}
