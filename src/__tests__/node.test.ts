import { NodeMap } from '../node';

const TEST_NODE_VALUE = { name: 'miles', parentId: null, isDir: true };

describe('Node Test Suite', () => {
  const nodeMap = new NodeMap();
  test('can initialize', () => {
    expect(nodeMap.size()).toEqual(0);
    expect(nodeMap.getNode(0)).toBeUndefined();
  });
  test('can set node', () => {
    const res = nodeMap.setNode(TEST_NODE_VALUE);
    expect(nodeMap.size()).toEqual(1);
    expect(res).toBe(0);
  });
  test('can get node', () => {
    expect(nodeMap.getNode(0)).toEqual(TEST_NODE_VALUE);
  });
  test('can set parent', () => {
    expect(nodeMap.getNode(0)).toEqual(TEST_NODE_VALUE);
  });
  test('can handle parent', () => {
    const id = nodeMap.handleParent(['/', 'miles', 'davis'], null);
    expect(nodeMap.getNode(id)).toEqual({
      name: 'miles',
      parentId: 2,
      isDir: true,
    });
  });
  test('can handle non-index child', () => {
    const id = nodeMap.handleChild('davis', 2);
    expect(nodeMap.getNode(id)).toEqual({
      name: 'davis',
      parentId: 2,
      isDir: false,
    });
  });
  test('can handle index child', () => {
    const id = nodeMap.handleChild('index', 0);
    expect(nodeMap.getNode(id)).toEqual({
      name: '',
      parentId: 0,
      isDir: false,
    });
  });
});
