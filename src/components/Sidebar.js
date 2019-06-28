import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { appRoutes } from "../constants/routes";
import AppContext, { appContextActions } from "../context/AppContext";

function Sidebar({ history, location }) {

    const [appContext, dispatch] = useContext(AppContext);

    const links = [
        {
            title: "Query dashboard",
            icon: "spreadsheet",
            link: appRoutes.queryDashboard,
            forAllMembers: false
        },
        {
            title: "Data queries",
            icon: "spreadsheet",
            link: appRoutes.queryEditor,
            forAllMembers: true
        },
        {
            title: "BI request",
            icon: "spreadsheet",
            link: appRoutes.biLink,
            forAllMembers: true
        }
    ];   

    function setActive(link) {

        return location.pathname.indexOf(link) > -1 ? "active" : "";
    }

    function logout(e) {

        e.preventDefault();
        dispatch({ type: appContextActions.showSpinner });
        appContext.auth.logout()
    }

    function goTo(e) {

        if (e.target.dataset.url === appRoutes.biLink) {
            return;
        }       
        
        if (location.pathname.indexOf(e.target.dataset.url) === -1) {
            
            dispatch({ type: appContextActions.showSpinner });
        }
        
        e.preventDefault();
        history.push(e.target.dataset.url);
    }

    return (
        <div className="sidebar">
            <div>
                <ul>
                    {appContext.currentUser && links.map(item => (item.forAllMembers || appContext.currentUser.isTeamLead) && 
                        <li key={item.title} className="mb-3">
                            <a
                                onClick={goTo}
                                href={item.link}
                                data-url={item.link}
                                className={`inherit ${setActive(item.link)}`}>
                                <span className="oi pr-2" data-glyph={item.icon} />
                                {item.title}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            <hr />
            <div>{appContext.currentUser && appContext.currentUser.name}</div>
            <div className="mt-3">
                <a className="inherit" href="/" onClick={logout}>
                    <span className="oi pr-2" data-glyph="account-logout" />
                    {/* <img src={`/img/logout.svg`} alt="logout" className="pr-2" /> */}
                    Logout
                </a>
            </div>
        </div>
    )
}

export default withRouter(Sidebar);