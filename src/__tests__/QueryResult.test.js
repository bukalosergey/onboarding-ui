import React from "react";
import { mount } from "enzyme";
import QueryResult from "../components/queryPage/QueryResult";
import { queryPageActions } from "../components/queryPage/queryPageActions";

describe("QueryResult", () => {

    test("shoud mount", () => {

        const dispatch = jest.fn();
        const props = {
            auditRecordId: undefined,
            queryText: "queryText",
            columns: ["column_1", "column_2"],
            rows: [
                ["row_1", "row_2"],
                ["row_1", "row_2"]
            ]
        };

        const queryResult = mount(<QueryResult queryResult={props} dispatch={dispatch} />);

        expect(queryResult.find("th")).toHaveLength(2);
        expect(queryResult.find("tr")).toHaveLength(3);

        const exportButton = queryResult.find("button").first();

        exportButton.simulate("click");
        expect(dispatch).toBeCalledWith(expect.objectContaining({ type: queryPageActions.exportDataToCsv }))
    })
})