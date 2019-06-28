import React from "react";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import QueryForm from "../components/queryPage/QueryForm";
import { Formik } from "formik";
import { queryDashboardActions } from "../components/queryDashboard/queryDashboardActions";

describe("QueryForm", () => {

    /** @type {Enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>} */
    let queryForm;
    let submit;
    let dispatch;
    let state;
    let initialValues;

    beforeEach(() => {

        submit = jest.fn();
        dispatch = jest.fn();
        state = {
            serverList: [{ value: "server_1", label: "server_1" }]
        };
        initialValues = {
            ticketSystem: { value: "ticketSystem", label: "ticketSystem" },
            ticketNumber: "ticketNumber",
            reasonForChange: "reasonForChange",
            server: { value: "server", label: "server" },
            database: { value: "database", label: "database" },
            queryText: "queryText"
        }

        queryForm = Enzyme.mount(
            <Formik
                onSubmit={submit}
                initialValues={initialValues}
                render={(props) => <QueryForm {...props} dispatch={dispatch} state={state} />} />
        );
    })

    test.each([
        ["input[name='ticketSystem']", "ticketSystem", true],
        ["input[name='ticketNumber']", "ticketNumber", false],
        ["input[name='reasonForChange']", "reasonForChange", false],
        ["input[name='server']", "server", true],
        ["input[name='database']", "database", true],
        ["textarea[name='queryText']", "queryText", false]
    ])("renders selector %s with value %s", 
    /**
     * @param {string} selector,
     * @param {string} value,
     * @param {boolean} isSelect
     */
    async (selector, value, isSelect) => {

        const wrapper = queryForm.find(selector);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.first().prop("value")).toEqual(value);

        if (isSelect) return;
        
        await act(async () => {
            wrapper.first().simulate("change", { target: { value: "test", name: value } });
        })

        queryForm.update();

        await act(async () => {
            queryForm.find("form").simulate("submit")
        })

        expect(submit).toBeCalledWith(expect.objectContaining({ [value]: "test" }), expect.anything());
    });

    test("should change storedProcedureUpdate", async () => {

        const yesButton = queryForm.find("button.btn-outline-success").first();

        expect(yesButton.text()).toBe("Yes");

        await act(async () => {
            yesButton.simulate("click")
        })

        await act(async () => {
            queryForm.find("form").simulate("submit")
        })

        expect(submit).toBeCalledWith(expect.objectContaining({ storedProcedureUpdate: 1 }), expect.anything());
    })

    test("should render error", async () => {

        state.error = "new error";
        const queryForm = Enzyme.mount(
            // @ts-ignore
            <QueryForm 
                dispatch={dispatch} 
                state={state} 
                values={initialValues}
                handleChange={jest.fn()}
                touched={{}} />
        );

        expect(queryForm.find(".alert-danger.alert-dismissible")).toHaveLength(1);
        expect(queryForm.text()).toContain(state.error);

        await act(async () => {
            queryForm.find(".close").simulate("click")
        })

        expect(dispatch).toBeCalledWith({ type: queryDashboardActions.resetError });

        queryForm.setProps({ state: { error: "" } });
        expect(queryForm.find(".alert-danger.alert-dismissible")).toHaveLength(0);
    })

})

