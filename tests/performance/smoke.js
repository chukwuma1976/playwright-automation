import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const TEST_URL = "https://automationexercise.com/api/productsList";

export const options = {
    vus: 5,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01']
    }
};

function getResource(url) {

    const res = http.get(url);

    check(res, {
        'status is 200': (r) => r.status === 200
    });

    sleep(Math.random() * 3); //Simulate user think time

    return res;
}

export default () => getResource(TEST_URL);

export function handleSummary(data) {
    return {
        "test-results/smoke-report.html": htmlReport(data),
    };
}