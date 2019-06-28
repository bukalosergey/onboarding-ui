// DO NOT EDIT

// This file get's populated by variables from the environment.
// If you need to make changes to it make a copy of .env
// from the package root folder into .env.local and make
// your modifications there.

export default {

    environment: (process && process.env.NODE_ENV) || "production",
    /**
     * @description okta authorization settings
     * env variable placeholder for client_id
     * OKTA_CLIENT_ID
     */
    okta: {
        /**
         * @description url for authentication server
         * env variable placeholder
         * APP_OKTA_ISSUER 
         */
        url: process.env.REACT_APP_OKTA_URL,
        issuer: process.env.REACT_APP_OKTA_ISSUER,

        /**
        * @description URI where Okta will send OAuth responses.
        * had to massage the url to remove latest forward slash
        */
        redirect_uri: window.location.origin + process.env.REACT_APP_ROUTING_BASE_PATH + '/implicit/callback',
        client_id: process.env.REACT_APP_OKTA_CLIENT_ID
    },

    /**
     * @description url for api requests
     * env variable placeholder
     * APP_API_BASE_URL 
     */
    apiBaseURL: process.env.REACT_APP_API_BASE_URL,
    /**
     * @description base path for react routing
     * env variable placeholder
     * APP_ROUTING_BASE_PATH 
     */
    routingBasePath: process.env.REACT_APP_ROUTING_BASE_PATH
}
