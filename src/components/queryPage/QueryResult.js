import React from "react";
import { ListGroup, Row, Container, Col, Table, Button } from "react-bootstrap";
import { queryPageActions } from "./queryPageActions";

/** @type {IQueryResult & React.Dispatch<IAction>} */
function QueryResult({
    dispatch,
    queryResult = {
        auditRecordId: undefined,
        queryText: "",
        columns: [],
        rows: []
    }
}) {

    return <div>
        <ListGroup className="mb-1">
            <ListGroup.Item>
                <Container>
                    <Row >
                        <Col>
                            <h5 className="d-inline">Query name</h5>
                        </Col>
                    </Row>
                </Container>
            </ListGroup.Item>
            <ListGroup.Item>
                <Container>
                    <Row>
                        <Col>
                            <p>{queryResult.queryText}</p>
                        </Col>
                    </Row>
                </Container>
            </ListGroup.Item>
        </ListGroup>
        <ListGroup>
            <ListGroup.Item>
                <Container>
                    <Row >
                        <Col md={10}>
                            <h5 className="d-inline">Query results</h5>
                            <p className="d-inline ml-3 mr-3 gray-text">|</p>
                            <p className="d-inline gray-text">{queryResult.rows.length} items in the list</p>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => dispatch({ 
                                    type: queryPageActions.exportDataToCsv,
                                    payload: {
                                        data: [
                                            queryResult.columns,
                                            ...queryResult.rows
                                        ],
                                        id: queryResult.auditRecordId
                                    }
                                })}>
                                Export CSV
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </ListGroup.Item>
            <ListGroup.Item>
                <Container>
                    <Row className="overflow-x-scroll font-small">
                        <Table hover>
                            <thead>
                                <tr>
                                    {queryResult.columns.map((item, i) => (
                                        <th key={i}>{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {queryResult.rows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((item, j) => (
                                            <td key={j}>{item}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </ListGroup.Item>
        </ListGroup>
    </div>
}

export default QueryResult