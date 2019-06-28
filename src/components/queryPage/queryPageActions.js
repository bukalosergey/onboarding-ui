import httpClient from "../../services/httpClient.service";
import { appContextActions } from "../../context/AppContext";
import csvService from "../../services/csv.service";
import debugService from "../../services/debug.service";

export const queryPageActions = {
    saveQuery: "saveQuery",
    deleteQuery: "deleteQuery",
    tryRunQuery: "tryRunQuery",
    deleteCurrentQuery: "deleteCurrentQuery",
    saveCurrentQuery: "saveCurrentQuery",
    setQueryResult: "setQueryResult",
    resetQueryResult: "resetQueryResult",
    getDropdownOptions: "getDropdownOptions",
    getDbList: "getDbList",
    setError: "setError",
    resetError: "resetError",
    exportDataToCsv: "exportDataToCsv",
    loadingDbList: "loadingDbList"
};

/**
 * @param {IQueryPage} state 
 * @param {IAction} action 
 * @returns {IQueryPage}
 */
export function queryPageReducer(state, action) {

    switch (action.type) {
        case queryPageActions.saveQuery:

            return {
                ...state,
                queries: state.queries.concat(action.payload)
            };

        case queryPageActions.deleteQuery:

            return {
                ...state,
                queries: state.queries.filter(query => query !== action.payload)
            };

        case queryPageActions.tryRunQuery:

            return {
                ...state,
                currentQuery: action.payload
            };

        case queryPageActions.setQueryResult:

            return {
                ...state,
                error: "",
                queryResult: action.payload.queryResult,
                currentQuery: action.payload.currentQuery
            };

        case queryPageActions.resetQueryResult:

            return {
                ...state,
                queryResult: undefined
            };

        case queryPageActions.getDropdownOptions:

            return {
                ...state,
                error: "",
                serverList: action.payload.serverList,
                ticketSystemList: action.payload.ticketSystemList
            };

        case queryPageActions.getDbList:

            return {
                ...state,
                loadingDbList: false,
                error: "",
                dbList: action.payload
            };

        case queryPageActions.setError:

            return {
                ...state,
                error: action.payload.message
            };

        case queryPageActions.resetError:

            return {
                ...state,
                error: ""
            };

        case queryPageActions.loadingDbList:

            return {
                ...state,
                loadingDbList: true
            };

        default:
            break;
    }
}

/**
 * @param {React.Dispatch<IAction>} dispatch 
 * @param {React.Dispatch<IAction>} dispatchAppContext 
 */
export function queryPageReducerMiddleware(dispatch, dispatchAppContext) {

    /**
     * @param {IAction} action
     */
    async function resultFunction(action) {

        debugService.debug(action, "queryPageReducerMiddleware");

        if (action.type === queryPageActions.tryRunQuery) {

            await tryRunQuery(action, dispatch, dispatchAppContext);
            return;
        }

        if (action.type === queryPageActions.getDbList) {

            dispatch({ type: queryPageActions.loadingDbList });
            await getDbList(action, dispatch);
            return;
        }

        if (action.type === queryPageActions.exportDataToCsv) {

            csvService.exportDataToCsv(action.payload.data);
            await httpClient.resultExported(action.payload.id);
            return;
        }

        if (action.type === queryPageActions.getDropdownOptions) {

            await getDropdownOptions(dispatch, dispatchAppContext);
            return;
        }

        dispatch(action)
    }

    return resultFunction;
}

/**
 * @param {IAction} action 
 * @param {React.Dispatch<IAction>} dispatch 
 * @param {React.Dispatch<IAction>} dispatchAppContext 
 */
async function tryRunQuery(action, dispatch, dispatchAppContext) {

    dispatchAppContext({ type: appContextActions.showSpinner });

    try {

        const queryResult = await httpClient.queryExecute(action.payload);

        dispatch({
            type: queryPageActions.setQueryResult,
            payload: { queryResult, currentQuery: action.payload }
        })

    } catch (error) {

        dispatch({
            type: queryPageActions.setError,
            payload: error
        })
    }

    dispatchAppContext({ type: appContextActions.hideSpinner });
}

/**
 * 
 * @param {IAction} action 
 * @param {React.Dispatch<IAction>} dispatch 
 */
async function getDbList(action, dispatch) {

    try {
        const payload = await httpClient.getDbList(Number(action.payload));
        dispatch({
            type: queryPageActions.getDbList,
            payload
        });
    }
    catch (error) {
        dispatch({
            type: queryPageActions.setError,
            payload: error
        });
    }
}

/**
 * @param {React.Dispatch<IAction>} dispatch 
 * @param {React.Dispatch<IAction>} dispatchAppContext 
 */
async function getDropdownOptions(dispatch, dispatchAppContext) {

    try {

        const serverListPromise = httpClient.getServerList();
        const ticketSystemListPromise = httpClient.getTicketSystemList();

        const response = await Promise.all([serverListPromise, ticketSystemListPromise]);

        dispatch({
            type: queryPageActions.getDropdownOptions,
            payload: {
                serverList: response[0],
                ticketSystemList: response[1]
            }
        });

    } catch (error) {

        dispatch({
            type: queryPageActions.setError,
            payload: error
        })
    }

    dispatchAppContext({ type: appContextActions.hideSpinner });
}