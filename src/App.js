import React from "react";
import "./scss/general.scss";
import "react-datepicker/dist/react-datepicker.css";
import LoginPage from "./components/LoginPage";
import appConfig from "./app.config";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";
import { appRoutes } from "./constants/routes";
import QueryPage from "./components/queryPage/QueryPage";
import { AppContextProvider } from "./context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "open-iconic/font/css/open-iconic.css";
import QueryDashboard from "./components/queryDashboard/QueryDashboard";
import SecureRoute from "@okta/okta-react/dist/SecureRoute";

function App() {
    return (
        <div className="App">
            <BrowserRouter >
                <Security {...appConfig.okta} >
                    <AppContextProvider>
                        <header className="App-header" />
                        <Switch>
                            <Route path={appRoutes.implicitCallback} component={ImplicitCallback} />
                            <SecureRoute path={appRoutes.queryEditor} exact={true} component={QueryPage} />
                            <SecureRoute path={appRoutes.queryDashboard} component={QueryDashboard} />
                            <Route path={appRoutes.login} component={LoginPage} />
                            <Redirect to={appRoutes.login} />
                        </Switch>
                    </AppContextProvider>
                </Security>
            </BrowserRouter>
        </div>
    );
}

export default App;
