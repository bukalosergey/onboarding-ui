

interface IQueryDashboardFilter {
    dateFrom: Date;
    dateTo: Date;
    user: IOption
}

interface IAuditData {
    approvalDate: string;
    serverId: number;
    approversComment: string;
    createdDate: string;
    databaseName: string;
    queryApprovedBy: string;
    recordsAffected: number;
    resultsExported: number
}

interface IQueryDashboardState {
    auditData: IAuditData[];
    limit: number;
    currentPage: number;
    totalCount: number;
    filter: IQueryDashboardFilter;

    error: string;
}