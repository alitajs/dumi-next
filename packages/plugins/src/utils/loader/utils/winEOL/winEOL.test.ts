import winEOL from './index';

const isWindows =
  typeof process !== 'undefined' && process.platform === 'win32';

test('normal', () => {
  if (isWindows) {
    expect(winEOL('a \r\n b')).toEqual('a \n b');
    expect(winEOL('成 \r\n b')).toEqual('成 \n b');
    expect(winEOL('🍟 \r\n 🍔')).toEqual('🍟 \n 🍔');
    expect(winEOL(undefined)).toEqual(undefined);
  } else {
    expect(winEOL('a \n b')).toEqual('a \n b');
    expect(winEOL('成 \n b')).toEqual('成 \n b');
    expect(winEOL('🍟 \n 🍔')).toEqual('🍟 \n 🍔');
    expect(winEOL(undefined)).toEqual(undefined);
  }
});
