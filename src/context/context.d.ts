interface IUser {
    login: string;
    name: string;
    isTeamLead: boolean;
}

interface IAppContextObject {
    showSpinner: boolean;
    authenticated: boolean;
    currentUser: IUser;
    auth: {
        logout: () => void;
        [key: string]: any;
    };

    error: string;
}

interface IAction<T = any> {
    type: string;
    payload?: T;
}