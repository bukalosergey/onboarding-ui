import React from "react";
import Enzyme from "enzyme";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AppContext from "../context/AppContext";

describe("Sidebar", () => {

    test("shoud render 2 li for team member", () => {

        const dispatch = jest.fn();
        const props = {
            currentUser: {
                isTeamLead: false
            }
        };

        const queryResult = Enzyme.mount(
            <BrowserRouter >
                <AppContext.Provider value={[
                    // @ts-ignore
                    props, dispatch
                ]} >
                    <Sidebar />
                </AppContext.Provider>
            </BrowserRouter>
        );

        expect(queryResult.find("li")).toHaveLength(2);

    })

    test("shoud render 3 li for team leam", () => {

        const dispatch = jest.fn();
        const props = {
            currentUser: {
                isTeamLead: true
            }
        };

        const queryResult = Enzyme.mount(
            <BrowserRouter >
                <AppContext.Provider value={[
                    // @ts-ignore
                    props, dispatch
                ]} >
                    <Sidebar />
                </AppContext.Provider>
            </BrowserRouter>
        );

        expect(queryResult.find("li")).toHaveLength(3);

    })
})