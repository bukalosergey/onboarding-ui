import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import QueryForm from "./QueryForm";
import { Formik } from "formik";
import PageWithSidebar from "../PageWithSidebar";
import "../../scss/tooltip.scss";
import AppContext, { appContextActions } from "../../context/AppContext";
import QueryResult from "./QueryResult";
import { queryPageActions, queryPageReducer, queryPageReducerMiddleware } from "./queryPageActions";

/** @type {IQueryPage} */
const initialState = {
    queries: [],
    dbList: [],
    error: null,
    loadingDbList: false,
    serverList: [],
    ticketSystemList: [],
    currentQuery: {
        ticketNumber: "",
        ticketSystem: null,
        storedProcedureUpdate: 0,
        reasonForChange: "",
        server: null,
        database: null,
        queryText: ""
    },
    queryResult: null
};

function QueryPage() {

    const [state, dispatch] = React.useReducer(queryPageReducer, initialState);
    const [appContext, dispatchAppContext] = React.useContext(AppContext);
    const dispatchAsync = queryPageReducerMiddleware(dispatch, dispatchAppContext);

    React.useEffect(
        () => { initQueryPage(); },
        // eslint-disable-next-line
        [appContext.currentUser]
    )

    async function initQueryPage() {

        if (!appContext.currentUser) {

            dispatchAppContext({ type: appContextActions.getCurrentUser });
            return;
        }

        await dispatchAsync({ type: queryPageActions.getDropdownOptions });
    }

    /**
     * @param {IQueryForm} values 
     * @returns {import("formik").FormikErrors<IQueryForm>}
     */
    function validateForm(values) {

        const errors = {};

        Object.keys(initialState.currentQuery).forEach(field => {

            if (field !== "storedProcedureUpdate" && !values[field]) {
                errors[field] = "required";
            }
        })

        if (values.queryText && !values.storedProcedureUpdate && !values.queryText.trim().toLowerCase().startsWith("select")) {

            errors.queryText = "the first word must be a select";
        }

        return errors;
    }

    return <PageWithSidebar
        header={state.queryResult
            ? <Button
                variant="outline-secondary"
                type="button"
                className="mb-3 ml-3"
                onClick={() => dispatch({ type: queryPageActions.resetQueryResult })} >
                <span className="oi pr-2" data-glyph="arrow-left" />
                Go back to query editor
            </Button>
            : <h3 className="ml-3">Queries</h3>
        }>

        <Container fluid>
            <Row>
                {/* <Col md={3}>
                    <Card style={{ height: "100%" }}>
                        <Card.Body>
                            <QueryList queries={state.queries} />
                        </Card.Body>
                    </Card>
                </Col> */}
                <Col md={12}>
                    {state.queryResult
                        ? <QueryResult queryResult={state.queryResult} dispatch={dispatchAsync} />
                        : <Formik
                            validateOnChange={false}
                            validate={validateForm}
                            onSubmit={(payload) => dispatchAsync({
                                type: queryPageActions.tryRunQuery,
                                payload
                            })}
                            initialValues={{ ...state.currentQuery }}
                            render={(props) => <QueryForm {...props} dispatch={dispatchAsync} state={state} />} />
                    }
                </Col>
            </Row>
        </Container>
    </PageWithSidebar>
}

export default QueryPage;