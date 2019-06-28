import appConfig from "../app.config";

const basePath = appConfig.routingBasePath;

export const appRoutes = {
    root: `${basePath}`,
    login: `${basePath}/login`,
    biLink: "https://docs.google.com/forms/d/e/1FAIpQLSdJljxjLlP7g_zOi-jV4Z8lWlaebUdA437wAag1a6ZfwpqvVg/viewform",
    queryEditor: `${basePath}/query-editor`,
    resetPassword : `${basePath}/reset-password`,
    queryDashboard: `${basePath}/query-dashboard`,
    implicitCallback: `${basePath}/implicit/callback`
}