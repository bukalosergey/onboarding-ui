import React from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Col, Table, FormCheck, Button, ListGroup, Dropdown, DropdownButton, FormControl, Alert } from "react-bootstrap";
import QueryDashboardFilter from "./QueryDashboardFilter";
import { Formik } from "formik";
import PageWithSidebar from "../PageWithSidebar";
import AppContext, { appContextActions } from "../../context/AppContext";
import { queryDashboardReducer, queryDashboardReducerMiddleware, queryDashboardActions } from "./queryDashboardActions";
import { appRoutes } from "../../constants/routes";

/** @type { IQueryDashboardState } */
const initialState = {
    auditData: [],
    limit: 10,
    currentPage: 1,
    totalCount: 0,
    error: null,
    filter: {
        dateFrom: undefined,
        dateTo: undefined,
        user: undefined
    }
};


export default function QueryDashboard() {

    const [appContext, dispatchAppContext] = React.useContext(AppContext);
    const [state, dispatch] = React.useReducer(queryDashboardReducer, initialState);
    const dispatchAsync = queryDashboardReducerMiddleware(dispatch, dispatchAppContext);

    React.useEffect(
        () => { initQueryDashboard() },
        // eslint-disable-next-line
        [appContext.currentUser]
    )

    async function initQueryDashboard() {

        if (!appContext.currentUser) {

            dispatchAppContext({ type: appContextActions.getCurrentUser });
            return;
        }

        if (!appContext.currentUser.isTeamLead) {
            appContext.auth.logout();
            return;
        }

        dispatchGetAuditData();
    }

    function dispatchGetAuditData() {

        dispatchAsync({
            type: queryDashboardActions.getAuditData,
            payload: state
        })
    }

    return (
        <PageWithSidebar header={<h3 className="ml-3">Query dashboard</h3>}>
            {appContext.currentUser && appContext.currentUser.isTeamLead ?
                <Container fluid>
                    <Row>
                        <Col md={12}>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Container>
                                        <Row className="mb-3">
                                            <Col>
                                                <h5 className="d-inline">Queries</h5>
                                                <p className="d-inline ml-3 mr-3 gray-text">|</p>
                                                <p className="d-inline gray-text">{state.totalCount} Items in the list</p>
                                            </Col>
                                            {/* <Col style={{ textAlign: "right" }}>
                                            <Button variant="outline-secondary">Approve selected</Button>
                                        </Col> */}
                                        </Row>

                                        {state.error &&
                                            <Alert variant="danger" onClose={() => dispatchAsync({ type: queryDashboardActions.resetError })} dismissible>
                                                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                                <p>{state.error}</p>
                                            </Alert>
                                        }

                                        <Row >
                                            <Formik
                                                onReset={() => dispatchAsync({
                                                    type: queryDashboardActions.setFilter,
                                                    payload: {
                                                        state,
                                                        filter: {
                                                            dateFrom: undefined,
                                                            dateTo: undefined,
                                                            user: undefined
                                                        }
                                                    }
                                                })}
                                                onSubmit={(filter) => dispatchAsync({
                                                    type: queryDashboardActions.setFilter,
                                                    payload: { state, filter }
                                                })}
                                                initialValues={state.filter}
                                                render={props => <QueryDashboardFilter {...props} />} />
                                        </Row>
                                        <Row className="overflow-x-scroll font-small">
                                            <Table hover>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Results</th>
                                                        <th>Server list ID</th>
                                                        <th>Database</th>
                                                        <th>Records affected</th>
                                                        <th>Lead ID approved by</th>
                                                        <th>Approval date</th>
                                                        <th>Date created</th>
                                                        <th>Approver comments</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {state.auditData.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>
                                                                <FormCheck />
                                                            </td>
                                                            <td>{item.resultsExported}</td>
                                                            <td>{item.serverId}</td>
                                                            <td>{item.databaseName}</td>
                                                            <td>{item.recordsAffected}</td>
                                                            <td>{item.queryApprovedBy}</td>
                                                            <td>{item.approvalDate}</td>
                                                            <td>{item.createdDate}</td>
                                                            <td>{item.approversComment}</td>
                                                            <td><Button variant="outline-secondary">Approve</Button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Row>
                                        <Row className="mt-2">
                                            <Col md={6}>
                                                <DropdownButton
                                                    title={`Show ${state.limit} results per page`}
                                                    id="secondary"
                                                    onSelect={(/** @type {string} */ limit) => dispatchAsync({
                                                        type: queryDashboardActions.setLimit,
                                                        payload: {
                                                            limit,
                                                            currentPage: state.currentPage
                                                        }
                                                    })}
                                                    variant="outline-secondary">
                                                    {[10, 15, 20].map(item =>
                                                        <Dropdown.Item
                                                            key={item}
                                                            eventKey={item}
                                                            active={item === state.limit}>
                                                            {item}
                                                        </Dropdown.Item>
                                                    )}
                                                </DropdownButton>
                                            </Col>
                                            <Col md={6}>
                                                <Row>
                                                    <Col md={9}> Go to page </Col>
                                                    <Col md={3}>
                                                        <FormControl
                                                            value={String(state.currentPage)}
                                                            onBlur={dispatchGetAuditData}
                                                            onChange={(e) => dispatchAsync({
                                                                type: queryDashboardActions.setCurrentPage,
                                                                payload: e.target.value
                                                            })} />
                                                    </Col>
                                                </Row>

                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>
                            </ListGroup>

                        </Col>
                    </Row>
                </Container>
                : <Redirect to={appRoutes.login} />
            }
        </PageWithSidebar >
    )
}
