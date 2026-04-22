import http from 'k6/http';
import { check, sleep } from 'k6';
import { apiURL } from '../../main/configuratons/config.ts';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const TEST_URL = `${apiURL}/productsList`;

export const options = {
    vus: 50,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01']
    }
};

function getProducts(url) {

    const res = http.get(url);

    check(res, {
        'status is 200': (r) => r.status === 200
    });

    sleep(Math.random() * 3); //Simulate user think time

    return res;
}

export default () => getProducts(TEST_URL);

export function handleSummary(data) {
    return {
        "test-results/load-report.html": htmlReport(data),
    };
}