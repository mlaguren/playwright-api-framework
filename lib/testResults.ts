import { APIRequestContext, APIResponse } from '@playwright/test';

interface TestResultData {
    project: string;
    pass: number;
    fail: number;
    skipped: number;
}

class TestResults {
    private apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async createTestResults(data: TestResultData): Promise<APIResponse> {
        const response = await this.apiContext.post('/api/test_results', {
            data: data,
        });
        return response;
    }

    async retrieveTestResults(params: Record<string, string>): Promise<APIResponse> {
        const response = await this.apiContext.get('/api/test_results', {
            params: params,
        });
        return response;
    }
}

export default TestResults;
