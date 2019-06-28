import React from "react";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import { Formik } from "formik";
import QueryDashboardFilter from "../components/queryDashboard/QueryDashboardFilter";

jest.mock("../services/httpClient.service", () => ({

    getAuditUsers: jest.fn().mockResolvedValue({ data: { items: [] } }),
}))

describe("QueryDashboardFilter", () => {

    /** @type {Enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>} */
    let wrapper;
    let resetHandler;
    /** @type {jest.Mock<any, any>} */
    let submitHandler;
    let filter;

    beforeEach(async () => {

        submitHandler = jest.fn();
        resetHandler = jest.fn();
        filter = {
            user: undefined,
            dateFrom: undefined,
            dateTo: undefined
        }

        await act(async () => {
            wrapper = Enzyme.mount(
                <Formik
                    onReset={resetHandler}
                    onSubmit={submitHandler}
                    initialValues={filter}
                    render={props => <QueryDashboardFilter {...props} />} />
            );
        })
    })

    test.each([
        ["dateFrom", new Date()],
        ["dateTo", new Date()],
    ])("should render input %s and change value to %s", 
    /**
     * @param {string} control
     * @param {Date} date
     */
    async (control, date) => {

        const dateFromWrapper = wrapper.find(`input[name='${control}']`);
        /** @type {HTMLInputElement} */
        const dateFrom = dateFromWrapper.getDOMNode();
        dateFrom.value = date.toJSON();

        await act(async () => {
            dateFromWrapper.simulate("change")
        })

        wrapper.update();

        const formWrapper = wrapper.find("form");

        await act(async () => {
            formWrapper.simulate("submit");
        })

        expect(submitHandler).toBeCalledWith(expect.objectContaining({ [control]: date }), expect.anything());
    })

    test("should reset form", async () => {

        const dateFromWrapper = wrapper.find(`input[name='dateTo']`);
        /** @type {HTMLInputElement} */
        const dateFrom = dateFromWrapper.getDOMNode();
        dateFrom.value = new Date().toJSON();

        await act(async () => {
            dateFromWrapper.simulate("change")
        })

        wrapper.update();

        const formWrapper = wrapper.find("form");

        await act(async () => {
            formWrapper.simulate("reset");
        })

        expect(dateFromWrapper.prop("value")).toEqual("");
    })

})