import React from "react";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import QueryDashboard from "../components/queryDashboard/QueryDashboard";
import Security from "@okta/okta-react/dist/Security";
import { BrowserRouter } from "react-router-dom";
import appConfig from "../app.config";
import AppContext from "../context/AppContext";
import mockHtmlClient from "../services/httpClient.service";

jest.mock("../services/httpClient.service", () => ({
    getAuditData: jest.fn().mockResolvedValue({
        items: [{}, {}]
    }),
    getAuditUsers: jest.fn().mockResolvedValue({ data: { items: [] } }),
}))

const appContextProps = {
    showSpinner: true,
    currentUser: {
        isTeamLead: true,
        name: "",
        login: ""
    },
    authenticated: false,
    auth: null,
    error: null
}

const appContextDispatch = jest.fn();

async function getQueryDashboard(props) {

    /** @type {Enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>} */
    let wrapper;
    await act(async () => {

        wrapper = Enzyme.mount(
            <BrowserRouter >
                <Security {...appConfig.okta} >
                    <AppContext.Provider value={[props, appContextDispatch]}>
                        <QueryDashboard />
                    </AppContext.Provider>
                </Security>
            </BrowserRouter>
        );
    });
    wrapper.update();
    return wrapper;
}

describe("QueryDashboard", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("should render 3 rows", async () => {

        const wrapper = await getQueryDashboard(appContextProps);
        expect(wrapper.find("tr")).toHaveLength(3);
    })

    test("should render error", async () => {

        const errorText = "some error";
        // @ts-ignore
        mockHtmlClient.getAuditData.mockRejectedValueOnce(new Error(errorText));
        let wrapper = await getQueryDashboard(appContextProps);

        expect(wrapper.find(".alert-danger.alert-dismissible").text()).toContain(errorText);

        await act(async () => {
            wrapper.find(".close").simulate("click");
        })

        wrapper.update();
        expect(wrapper.find(".alert-danger.alert-dismissible")).toHaveLength(0);
    })

    test("should not render for team member", async () => {

        const contextProps = {
            ...appContextProps,
            auth: { logout: jest.fn() },
            currentUser: {
                isTeamLead: false,
                name: "",
                login: ""
            }
        };

        const wrapper = await getQueryDashboard(contextProps);
        expect(wrapper.find("tr")).toHaveLength(0);
        expect(contextProps.auth.logout).toBeCalled();
    })
})