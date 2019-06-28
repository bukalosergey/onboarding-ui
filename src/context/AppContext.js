import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import httpClient from "../services/httpClient.service";
import withAuth from "@okta/okta-react/dist/withAuth";
import { Alert } from "react-bootstrap";
import debugService from "../services/debug.service";

/** @type {IAppContextObject} */
const initialContext = {
    showSpinner: true,
    currentUser: undefined,
    authenticated: false,
    auth: null,
    error: null
}

export const appContextActions = {
    showSpinner: "showSpinner",
    hideSpinner: "hideSpinner",
    getCurrentUser: "getCurrentUser",
    setAppError: "setAppError",
    resetAppError: "resetAppError"
}

/**
 * @param {IAppContextObject} state 
 * @param {IAction} action 
 * @returns {IAppContextObject}
 */
function appContextReducer(state, action) {

    switch (action.type) {
        case appContextActions.showSpinner:
            return state.showSpinner ? state : { ...state, showSpinner: true };

        case appContextActions.hideSpinner:
            return !state.showSpinner ? state : { ...state, showSpinner: false };

        case appContextActions.getCurrentUser:
            return {
                ...state,
                currentUser: action.payload
            };

        case appContextActions.setAppError:
            return {
                ...state,
                showSpinner: false,
                error: action.payload
            };

        case appContextActions.resetAppError:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

/**
 * @param {React.Dispatch<IAction>} dispatch
 */
function appContextReducerMiddleware(dispatch) {

    /**
     * @param {IAction} action 
     */
    async function resultFunction(action) {

        debugService.debug(action, "appContextReducerMiddleware");

        switch (action.type) {
            case appContextActions.getCurrentUser:

                await getCurrentUser(dispatch);
                break;

            default:
                dispatch(action);
        }
    }

    return resultFunction;
};

/** @type {React.Context<[IAppContextObject, React.Dispatch<IAction>]> } */
const AppContext = React.createContext([initialContext, (action) => { }]);

/**
 * @param {React.Dispatch<IAction>} dispatch 
 */
async function getCurrentUser(dispatch) {

    try {

        const payload = await httpClient.getCurrentUser();

        dispatch({
            type: appContextActions.getCurrentUser,
            payload
        });

    } catch (error) {

        dispatch({
            type: appContextActions.setAppError,
            payload: "failed to get user settings"
        });
    }

}

function AppContextProviderWithAuth({ children, auth }) {

    const [context, dispatch] = React.useReducer(appContextReducer, { ...initialContext, auth });
    const dispatchAsync = appContextReducerMiddleware(dispatch);

    return <AppContext.Provider value={[context, dispatchAsync]}>
        <Spinner showSpinner={context.showSpinner} />
        {context.error
            ? <Alert variant="danger" className="mt-4" dismissible onClose={() => {
                dispatch({ type: appContextActions.resetAppError })
                context.auth.logout();
            }}>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>{context.error}</p>
            </Alert>
            : children
        }
    </AppContext.Provider>
}

// @ts-ignore
export const AppContextProvider = withAuth(withRouter(AppContextProviderWithAuth));

export default AppContext;