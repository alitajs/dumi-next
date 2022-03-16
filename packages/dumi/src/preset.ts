import type { IApi } from 'umi';

export default (api: IApi) => {
  api.onStart(() => {
    console.log('Hello dumi-next');
  });
  const plugins = [
    require.resolve('./features/config/dumiconfig'),
    require.resolve('@dumi/plugins/dist/init'),
  ];
  return {
    plugins,
  };
};
