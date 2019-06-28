import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar";
import { appRoutes } from "../constants/routes";
import AppContext from "../context/AppContext";

export default function PageWithSidebar({ children, header }) {

    const [appContext] = useContext(AppContext);

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={2} className="header-logo">
                    <h4 className="mb-0">Hermes</h4>
                    <img src={`${appRoutes.root}/img/checkout_logo.svg`} alt="checkout" />
                </Col>
                <Col md={10}>
                    {header}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Sidebar />
                </Col>
                <Col md={10}>
                    {appContext.currentUser && children}
                </Col>
            </Row>
        </Container>
    )
}
