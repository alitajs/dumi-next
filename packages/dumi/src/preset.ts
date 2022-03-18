import type { DumiApi } from '@dumijs/core';

export default (api: DumiApi) => {
  api.onStart(() => {
    console.log('Hello dumi-next');
  });
  const plugins = [
    require.resolve('./features/config/dumiconfig'),
    require.resolve('@dumi/plugins/dist/init'),
    require.resolve('@dumi/plugins/dist/theme'),
    require.resolve('@dumi/plugins/dist/md'),
  ];
  return {
    plugins,
  };
};
