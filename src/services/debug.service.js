
const debugService = {
    /**
     * @description execute console.debug in development
     * @param  {...any} params 
     */
    debug(...params) {

        process && process.env.NODE_ENV === "development" && console.debug(...params);
    }
}

export default debugService;