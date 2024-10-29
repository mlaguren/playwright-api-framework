import { test, expect, request, APIRequestContext } from '@playwright/test';
import TestResults from '../../lib/testResults'; // Import the API object
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

  test('POST /api/test_results - Create new test results', async () => {
    const newResults = { project: 'API', pass: 1147, fail: 112, skipped: 55 };
    const response = await testResults.createTestResults(newResults); // Use the instance method
    console.log('Response status:', response.status());
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.project).toBe(newResults.project);
    expect(responseBody.pass).toBe(newResults.pass);
    expect(responseBody.fail).toBe(newResults.fail);
    expect(responseBody.skipped).toBe(newResults.skipped);
    expect(responseBody.pass_rate).toBe(87.29);
  });

  test('GET /api/test_results - Get Test Results From Confluence', async () => {
    const response = await testResults.retrieveTestResults({
      project: 'API',
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    console.log(responseBody);
    expect(parseInt(responseBody.pass)).toBe(1147);
    expect(parseInt(responseBody.fail)).toBe(112);
    expect(parseInt(responseBody.skipped)).toBe(55);
  });
});
