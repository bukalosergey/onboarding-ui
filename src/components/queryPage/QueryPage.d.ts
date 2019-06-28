interface IOption {
    value: string;
    label: string;
}

interface IServerOption extends IOption {
    commandTimeout: number,
    maxResultRows: number
}


interface IQueryForm {
    ticketNumber: string;
    ticketSystem: IOption;
    storedProcedureUpdate: number;
    reasonForChange: string;
    server: IServerOption;
    database: IOption;
    queryText: string
}

interface IQueryResult {
    auditRecordId: number,
    queryText: string,
    columns: string[],
    rows: Array<string[]>
}

interface IQueryPage {

    error: string;
    queries: any[];
    currentQuery: IQueryForm;
    queryResult: null,
    loadingDbList: boolean;

    serverList: any[];
    dbList: any[];

    ticketSystemList: any[];
}