import React from "react";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import { BrowserRouter } from "react-router-dom";
import { Security } from "@okta/okta-react";
import { AppContextProvider, appContextActions } from "../context/AppContext";
import appConfig from "../app.config";

const useReducer = React.useReducer;

async function getAppContext() {

    /** @type {Enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>} */
    let wrapper;
    await act(async () => {

        wrapper = Enzyme.mount(
            <BrowserRouter >
                <Security {...appConfig.okta} >
                    <AppContextProvider />
                </Security>
            </BrowserRouter>
        )
    })

    return wrapper;
}

describe.only("AppContextProvider", () => {

    afterAll(() => {
        React.useReducer = useReducer;
    })

    test('should render with spinner', async () => {

        const wrapper = await getAppContext();
        expect(wrapper.find(".spinner_container").hasClass("hidden_spinner")).toBeFalsy();
    })

    test('should render with hidden spinner', async () => {

        React.useReducer = jest.fn().mockReturnValueOnce([
            {
                showSpinner: false
            },
            jest.fn()
        ])

        const wrapper = await getAppContext();
        expect(wrapper.find(".spinner_container").hasClass("hidden_spinner")).toBeTruthy();
    })

    test('should render error', async () => {

        const auth = { logout: jest.fn() }
        const dispatch = jest.fn();
        React.useReducer = jest.fn().mockReturnValueOnce([
            {
                error: "some error",
                auth
            },
            dispatch
        ])

        const wrapper = await getAppContext();
        expect(wrapper.find(".alert-danger.alert-dismissible").text()).toContain("some error");

        await act(async () => {
            wrapper.find(".close").simulate("click");
        })

        expect(auth.logout).toBeCalled();
        expect(dispatch).toBeCalledWith(expect.objectContaining({ type: appContextActions.resetAppError }));
    })
})