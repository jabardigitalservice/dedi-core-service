import { testExample } from './example';

test('test example', () => {
  expect(testExample('test example')).toContain('test');
});
