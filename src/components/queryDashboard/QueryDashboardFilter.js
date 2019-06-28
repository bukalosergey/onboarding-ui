import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Form, Row, Container, Col, Button } from "react-bootstrap";
import httpClient from "../../services/httpClient.service";

/**
 * @description query filter
 * @param {import("formik").FormikProps<IQueryDashboardFilter>} param
 */
export default function QueryDashboardFilter({
    values,
    setFieldValue,
    handleSubmit,
    handleReset
}) {

    /** @type {IOption[]} */
    const initialValues = [];
    const [users, setUsers] = React.useState(initialValues);

    React.useEffect(
        () => { httpClient.getAuditUsers().then(setUsers) },
        []
    )

    return (
        <Form onSubmit={handleSubmit} onReset={handleReset}>
            <Container fluid={true}>
                <Row>
                    <Col md={2}>
                        Filter
                    </Col>
                    <Col md={7}>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="user">
                                    <Select
                                        key={values.user && values.user.value}
                                        className="select"
                                        placeholder="User"
                                        name="user"
                                        options={users}
                                        onChange={item => setFieldValue("user", item)}
                                        value={values.user} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <DatePicker
                                    name="dateFrom"
                                    selected={values.dateFrom}
                                    onChange={(option) => setFieldValue("dateFrom", option)} />
                            </Col>
                            <Col md={4}>
                                <DatePicker
                                    name="dateTo"
                                    selected={values.dateTo}
                                    onChange={(option) => setFieldValue("dateTo", option)} />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3} >
                        <div className="float-right">
                            <Button variant="outline-success" className="mr-2" type="submit">Apply</Button>
                            <Button variant="outline-success" type="reset">Reset</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Form>
    )
}
