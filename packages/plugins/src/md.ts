import type { DumiApi } from '@dumijs/core';
import { context } from '@dumijs/core';
import { logger } from '@umijs/utils';

export default (api: DumiApi) => {
  api.onStart(() => {
    logger.info('Using Md Plugin');
  });

  api.modifyDefaultConfig((memo) => {
    memo.mdx = {
      loader: require.resolve('./utils/loader'),
      loaderOptions: {
        previewLangs: context.opts?.resolve?.previewLangs,
        passivePreview: context.opts?.resolve?.passivePreview,
      },
    };
    return memo;
  });
};
