import Axios from "axios";
import { Auth } from "@okta/okta-react";
import appConfig from "../app.config";
import { mapSelectOptions } from "../utils/selectOptionsMapper";

// creates an authorization header
const auth = new Auth(appConfig.okta);
// base url for api requests
const baseURL = appConfig.apiBaseURL;

async function getHeaders() {

    return {
        Authorization: "Bearer " + await auth.getAccessToken(),
        "Content-Type": "application/json"
    };
}

/**
 * @param {*} params 
 * @returns {string}
 */
function stringifyQueryParams(params) {

    let string = "";

    for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== undefined) {

            string += (string ? "&" : "?") + `${key}=${params[key]}`;
        }
    }

    return string;
}

const httpClient = {

    /**
     * @description return the list of available servers
     * @returns {Promise<IServerOption[]>}
     */
    async getServerList() {

        const headers = await getHeaders();
        const { data } = await Axios.get("/servers", { headers, baseURL });

        return data.items.map(item => ({
            ...mapSelectOptions(item),
            commandTimeout: item.command_timeout,
            maxResultRows: item.max_result_rows
        }))
    },

    /**
    * @description return the list of available ticket systems
    * @returns {Promise<IOption[]>}
    */
    async getTicketSystemList() {

        const headers = await getHeaders();
        const { data } = await Axios.get("/ticketsystems", { headers, baseURL });

        return data.items.map(mapSelectOptions);
    },

    /**
     * @description return the db list for the current user
     * @param {number} id 
     * @returns {Promise<IOption[]>}
     */
    async getDbList(id) {

        const headers = await getHeaders();
        const { data } = await Axios.get(`/servers/${id}/databases`, { headers, baseURL });

        return data.items.map((item) => ({
            value: item.name,
            label: item.name
        }));
    },

    /**
     * @description return cureent user information
     * @returns {Promise<IUser>}
     */
    async getCurrentUser() {

        const headers = await getHeaders();
        const { data } = await Axios.get(`/users/current`, { headers, baseURL });

        return {
            isTeamLead: data.is_team_lead,
            login: data.login,
            name: data.name
        };
    },

    /**
     * @returns {Promise<IOption[]>}
     */
    async getAuditUsers() {

        const headers = await getHeaders();
        const { data } = await Axios.get(`/users/audit`, { headers, baseURL });

        return data.items.map(mapSelectOptions);
    },

    /**
     * @description return audit data
     * @param {{ limit: number, skip?: number, dateFrom?: Date, dateTo?: Date, user?: IOption }} params 
     * @returns {Promise<{ totalCount: number, items: IAuditData[] }>}
     */
    async getAuditData(params) {

        const filter = {
            date_from: params.dateFrom && params.dateFrom.toJSON(),
            date_to: params.dateTo && params.dateTo.toJSON(),
            user: params.user && params.user.label,
            skip: params.skip,
            limit: params.limit
        };

        const headers = await getHeaders();
        const response = await Axios.get(`/audit${stringifyQueryParams(filter)}`, { headers, baseURL });

        return {
            totalCount: response.data.total_count,
            items: response.data.items.map(item => ({
                approvalDate: item.approval_date,
                serverId: item.server_id,
                approversComment: item.approvers_comment,
                createdDate: item.created_date,
                databaseName: item.database_name,
                queryApprovedBy: item.query_approved_by,
                recordsAffected: item.records_affected,
                resultsExported: Number(item.results_exported)
            }))
        }
    },

    /**
     * @description return result of the executed query
     * @param {IQueryForm} queryParams 
     * @returns {Promise<IQueryResult>}
     */
    async queryExecute(queryParams) {

        const data = {
            ticket_number: Number(queryParams.ticketNumber),
            ticket_system_id: queryParams.ticketSystem.value || "",
            stored_procedure_update: queryParams.storedProcedureUpdate,
            reason_for_query: queryParams.reasonForChange,
            server_id: queryParams.server.value || "",
            database_name: queryParams.database.value || "",
            query_text: queryParams.queryText
        };

        const headers = await getHeaders();
        const response = await Axios.post(`/query/execute`, data, { headers, baseURL });

        return {
            auditRecordId: response.data.audit_record_id,
            columns: response.data.columns,
            rows: response.data.rows,
            queryText: response.data.query_text
        }
    },

    /**
     * @description set dataset result is exported to csv
     * @param {number} id 
     */
    async resultExported(id) {
        const headers = await getHeaders();
        return Axios.patch(`/audit/resultsexported/${id}`, {}, { headers, baseURL });
    }
};

export default httpClient;