export const apiURL = "https://automationexercise.com/api";
export const uiURL = "https://automationexercise.com";
export const selectorsHub = "https://selectorshub.com";
export const practiceAutomation = "https://practice-automation.com/";
export const playwright_dev_locators = "https://playwright.dev/docs/locators";
export const petStoreAPI = "https://petstore.swagger.io/v2";
export const httpBinAPI = "https://httpbin.org"
export const practiceTestingUi = "https://practice.expandtesting.com"
export const practiceTestingApi = "https://practice.expandtesting.com/notes/api";

export const generateFullURL = (baseURL: string, path: string = "") => `${baseURL}/${path}`;
export const generateLocatorURL = (baseURL: string, path: string = "") => `${baseURL}${path}`;