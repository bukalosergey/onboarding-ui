import httpClient from "../../services/httpClient.service";
import { appContextActions } from "../../context/AppContext";
import debugService from "../../services/debug.service";

export const queryDashboardActions = {
    getAuditData: "getAuditData",
    setLimit: "setLimit",
    setCurrentPage: "setCurrentPage",
    setError: "setError",
    resetError: "resetError",
    setFilter: "setFilter"
}

/**
 * @param {IQueryDashboardState} state 
 * @param {IAction} action
 * @returns {IQueryDashboardState} 
 */
export function queryDashboardReducer(state, action) {

    switch (action.type) {
        case queryDashboardActions.getAuditData:

            return {
                ...state,
                error: "",
                auditData: action.payload.items,
                totalCount: action.payload.totalCount
            };

        case queryDashboardActions.setLimit:

            return {
                ...state,
                limit: action.payload.limit
            };

        case queryDashboardActions.setCurrentPage:

            return {
                ...state,
                currentPage: action.payload
            };

        case queryDashboardActions.setError:

            return {
                ...state,
                error: action.payload.message
            };

        case queryDashboardActions.resetError:

            return {
                ...state,
                error: ""
            };

        case queryDashboardActions.setFilter:

            return {
                ...state,
                filter: action.payload
            };

        default:
            return state;
    }
}

/**
 * 
 * @param {React.Dispatch<IAction>} dispatch 
 * @param {React.Dispatch<IAction<IAppContextObject>>} dispatchAppContext 
 */
export function queryDashboardReducerMiddleware(dispatch, dispatchAppContext) {

    /**
     * 
     * @param {IAction} action 
     */
    async function resultFunction(action) {

        debugService.debug(action, "queryDashboardReducerMiddleware");

        switch (action.type) {
            case queryDashboardActions.getAuditData:

                await getAuditData(dispatch, dispatchAppContext, action.payload);
                break;

            case queryDashboardActions.setLimit:

                dispatch(action);
                await getAuditData(dispatch, dispatchAppContext, action.payload);
                break;

            case queryDashboardActions.setFilter:

                const { state, filter } = action.payload;
                action.payload = filter
                dispatch(action);
                await getAuditData(dispatch, dispatchAppContext, { ...state, filter });
                break;   

            default:
                dispatch(action);
                break;
        }
    }

    return resultFunction;

}

/**
 * 
 * @param {React.Dispatch<IAction>} dispatch 
 * @param {React.Dispatch<IAction>} dispatchAppContext 
 * @param {*} params 
 */
async function getAuditData(dispatch, dispatchAppContext, params) {

    try {
        
        const payload = await httpClient.getAuditData({
            limit: params.limit,
            skip: (params.currentPage - 1) * params.limit,
            ...params.filter
        });
        
        dispatch({
            type: queryDashboardActions.getAuditData,
            payload
        });

    } catch (error) {

        dispatch({
            type: queryDashboardActions.setError,
            payload: error
        });
    }

    dispatchAppContext({ type: appContextActions.hideSpinner });
}
