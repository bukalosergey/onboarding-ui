import React from "react";
import { act } from "react-dom/test-utils";
import Enzyme, { shallow } from "enzyme";
import QueryPage from "../components/queryPage/QueryPage";
import Security from "@okta/okta-react/dist/Security";
import { BrowserRouter } from "react-router-dom";
import appConfig from "../app.config";
import AppContext, { appContextActions } from "../context/AppContext";

jest.mock("../services/httpClient.service", () => ({

    getServerList: jest.fn().mockResolvedValue({
        data: { items: [{}, {}] }
    }),

    getTicketSystemList: jest.fn().mockResolvedValue({ data: { items: [{}] } }),

    queryExecute: jest.fn().mockResolvedValue({
        auditRecordId: 1,
        columns: ["", ""],
        rows: [["", ""], ["", ""]],
        queryText: "queryText"
    }),
}))

async function getQueryPage(params, dispatch = jest.fn()) {

    /** @type {Enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>} */
    let wrapper;
    await act(async () => {

        wrapper = Enzyme.mount(
            <BrowserRouter >
                <Security {...appConfig.okta} >
                    <AppContext.Provider value={[params, dispatch]} >
                        <QueryPage />
                    </AppContext.Provider>
                </Security>
            </BrowserRouter>
        )
    })

    return wrapper;
}

describe("QueryPage", () => {

    test("renders without crashing", () => {
        const queryPage = shallow(<QueryPage />);
        expect(queryPage.find("PageWithSidebar")).toHaveLength(1);
        expect(queryPage.find("Formik")).toHaveLength(1);
        expect(queryPage.contains("QueryResult")).toBeFalsy();
    });

    test("should call current user", async () => {

        const dispatch = jest.fn();
        await getQueryPage({}, dispatch);

        expect(dispatch).toBeCalledWith(expect.objectContaining({ type: appContextActions.getCurrentUser }));
    });

    test("should render current user", async () => {

        const dispatch = jest.fn();
        const page = await getQueryPage(
            { currentUser: { name: "current user" } }, 
            dispatch
        );

        expect(page.text()).toContain("current user");
        expect(dispatch).not.toBeCalledWith(expect.objectContaining({ type: appContextActions.getCurrentUser }));
        expect(dispatch).toBeCalledWith(expect.objectContaining({ type: appContextActions.hideSpinner }));
    });

    test("should render queryResult", async () => {

        const dispatch = jest.fn();
        const page = await getQueryPage(
            { currentUser: { name: "current user" } }, 
            dispatch
        );

        await act(async () => {
            page.find("form").simulate("submit");
        })

        page.update();
        const button = page.find("button").first();
        expect(button.text()).toEqual("Go back to query editor");

        await act(async () => {
            button.simulate("click");
        })

        page.update();
        expect(page.find("button").first().text()).not.toEqual("Go back to query editor");
    });
})

