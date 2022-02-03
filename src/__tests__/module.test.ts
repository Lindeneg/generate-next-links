import { main } from '../';
import { getConfig } from '../config';
import { MOCK_LINKS_ARRAY, MOCK_API_LINKS_ARRAY } from './test-util';

describe('Module Test Suite', () => {
  test('can do a dry run without api links', (done) => {
    const config = getConfig('./__mock__', [
      '',
      '',
      '--dry',
      '--convert-camel-case',
    ]);
    main(config, (result) => {
      expect(result[1]).toEqual(MOCK_LINKS_ARRAY());
      done();
    });
  });
  test('can do a dry run with api links', (done) => {
    const config = getConfig('./__mock__', [
      '',
      '',
      '--dry',
      '--api',
      '--convert-camel-case',
    ]);
    main(config, (result) => {
      expect(result[1]).toEqual(MOCK_LINKS_ARRAY(MOCK_API_LINKS_ARRAY()));
      done();
    });
  });
});
