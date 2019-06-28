import React from "react";
import { ListGroup, Row, Button, Container, Col, ButtonGroup, Form, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
import Select from "react-select"
import { queryPageActions } from "./queryPageActions";

/**
 * 
 * @param {import("formik").FormikProps<IQueryForm> & { state: IQueryPage, dispatch: React.Dispatch<IAction> }} param
 */
function QueryForm({
    state,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
    dispatch
}) {

    async function onServerChange(option) {

        setFieldValue("server", option);
        setFieldValue("database", "");
        dispatch({
            type: queryPageActions.getDbList,
            payload: option.value
        })
    }

    const disableDatabaseList = !values.server || state.loadingDbList;

    return <ListGroup>
        <ListGroup.Item>
            <Container>
                <Row >
                    <Col>
                        <h5 className="d-inline">Query name</h5>
                        <p className="d-inline ml-3 mr-3 gray-text">|</p>
                        <p className="d-inline gray-text">Command timeout: {values.server && values.server.commandTimeout}</p>
                        <p className="d-inline ml-3 mr-3 gray-text">|</p>
                        <p className="d-inline gray-text">Max records returned: {values.server && values.server.maxResultRows}</p>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-top">
                                    Your administrator controls these settings
                                </Tooltip>
                            }>
                            <div className="circle-border ml-3 gray-text">i</div>
                        </OverlayTrigger>
                    </Col>
                    {/*<Col>
                         <ButtonToolbar style={{ justifyContent: "flex-end" }} >
                            <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => dispatch({
                                    type: queryPageActions.deleteQuery,
                                    payload: values
                                })}>
                                <span className="glyphicon glyphicon-search" aria-hidden="true">
                                    Delete query
                                </span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => dispatch({
                                    type: queryPageActions.saveQuery,
                                    payload: values
                                })}>
                                Save query
                            </Button>
                        </ButtonToolbar> 
                    </Col>*/}
                </Row>
            </Container>

        </ListGroup.Item>
        <ListGroup.Item>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="ticketNumber">
                                <Form.Label className="mt-1">Ticket number<span className="required"> *</span></Form.Label>
                                <Form.Control
                                    isInvalid={Boolean(errors.ticketNumber)}
                                    type="text"
                                    onChange={handleChange}
                                    value={values.ticketNumber}
                                    name="ticketNumber" />
                                <Form.Control.Feedback type="invalid">
                                    {errors.ticketNumber}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="ticketSystem">
                                <Form.Label className="mt-1">Ticket system<span className="required"> *</span></Form.Label>
                                <Select
                                    required={true}
                                    className={`select ${Boolean(errors.ticketSystem) ? "is-invalid" : ""}`}
                                    options={state.ticketSystemList}
                                    value={values.ticketSystem}
                                    onChange={(item => setFieldValue("ticketSystem", item))} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.ticketSystem}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Label className="mt-1">Stored procedure update</Form.Label>
                            <ButtonGroup aria-label="Stored procedure update" size="sm">
                                <Button
                                    variant="outline-success"
                                    className={`pl-4 pr-4 ${values.storedProcedureUpdate ? "active" : ""}`}
                                    onClick={() => setFieldValue("storedProcedureUpdate", 1)}>
                                    Yes
                                </Button>
                                <Button
                                    variant="outline-success"
                                    className={`pl-4 pr-4 ${values.storedProcedureUpdate ? "" : "active"}`}
                                    onClick={() => setFieldValue("storedProcedureUpdate", 0)}>
                                    No
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col >
                            <Form.Group controlId="reasonForChange">
                                <Form.Label >Reason for change (short)<span className="required"> *</span></Form.Label>
                                <Form.Control
                                    isInvalid={Boolean(errors.reasonForChange)}
                                    type="text"
                                    onChange={handleChange}
                                    value={values.reasonForChange}
                                    name="reasonForChange" />
                                <Form.Control.Feedback type="invalid">
                                    {errors.reasonForChange}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="server">
                                <Form.Label className="mt-1">Server<span className="required"> *</span></Form.Label>
                                <Select
                                    required={true}
                                    className={`select ${Boolean(errors.server) ? "is-invalid" : ""}`}
                                    options={state.serverList}
                                    value={values.server}
                                    onChange={onServerChange} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.server}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="database">
                                <Form.Label className="mt-1">Database<span className="required"> *</span></Form.Label>
                                <Select
                                    isDisabled={disableDatabaseList}
                                    required={true}
                                    className={`select ${disableDatabaseList ? "disabled" : ""} ${Boolean(errors.database) ? "is-invalid" : ""}`}
                                    options={state.dbList}
                                    value={values.database}
                                    onChange={(item => setFieldValue("database", item))} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.database}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="queryText">
                                <Form.Label className="mt-1">Query<span className="required"> *</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="3"
                                    onChange={handleChange}
                                    value={values.queryText}
                                    name="queryText"
                                    isInvalid={Boolean(errors.queryText)} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.queryText}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>
                    {state.error &&
                        <Alert variant="danger" onClose={() => dispatch({ type: queryPageActions.resetError })} dismissible>
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <p>{state.error}</p>
                        </Alert>
                    }
                    <Row>
                        <Col><Button variant="primary" type="submit">Run query</Button></Col>
                    </Row>
                </Form>
            </Container>

        </ListGroup.Item>
    </ListGroup>
}

export default QueryForm