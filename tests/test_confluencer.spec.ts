import { test, expect, request, APIRequestContext } from '@playwright/test';
import TestResults from '../lib/testResults'; // Import the API object
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Integration Test For /api/test_results', () => {
    let apiContext: APIRequestContext;
    let testResults: TestResults;

    test.beforeAll(async () => {
        apiContext = await request.newContext({
            baseURL: process.env.BASE_URL, // API's base URL
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            },
        });
        testResults = new TestResults(apiContext); // Instantiate the TestResults object
    });

    test.afterAll(async () => {
        await apiContext.dispose(); // Clean up after tests
    });


    test('Update Confluence Page With Latest Test Results For A Given Project', async () => {
        const newResults = { project: 'API', pass: 1147, fail: 112, skipped: 55 };
        const response = await testResults.createTestResults(newResults); // Use the instance method
        expect(response.ok()).toBeTruthy();

        const projectResults = await testResults.retrieveTestResults({
            project: 'API',
        });

        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody.pass).toBe(1147);
        expect(responseBody.fail).toBe(112);
        expect(responseBody.skipped).toBe(55);

    });

});