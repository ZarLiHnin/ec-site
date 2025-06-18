// jest.setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';
// テスト開始前にモックサーバーを起動
beforeAll(() => server.listen());

// 各テスト後にハンドラの状態をリセット
afterEach(() => server.resetHandlers());

// 全テスト終了後にサーバーを閉じる
afterAll(() => server.close());
