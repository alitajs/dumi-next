import { logger } from '@umijs/utils';
import { DumiApi } from 'dumi';
import { init, setOptions } from './context';

const UMI_LIKE_PKGS = ['umi', '@alipay/bigfish'];

/**
 * dumi prepare plugin
 */
export default (api: DumiApi) => {
  api.onStart(() => {
    logger.info('Using Init Plugin');
  });
  const deps = Object.assign({}, api.pkg.dependencies, api.pkg.devDependencies);
  // enable ingetrate mode if dumi was registered as a umi preset on a umi like project
  const isIntegrateUmi =
    UMI_LIKE_PKGS.some((pkg) => deps[pkg]) &&
    deps['@dumi/plugins'] &&
    // also can force disable integrate mode by umi build --dumi
    api.args?.dumi === undefined;

  // init context & share umi api with other source module
  init(api, { isIntegrate: isIntegrateUmi } as any);

  // use modifyConfig api for update context
  // because both of the umi service init & user config changed will trigger this plugin key
  api.modifyConfig((memo) => {
    // share config with other source module via context
    setOptions('title', api.pkg.name || 'dumi');
    return memo;
  });

  // re-enable @ & @@ umi default alias for integrated mode
  if (isIntegrateUmi || api.args?.dumi) {
    api.modifyDefaultConfig((memo) => {
      memo.alias['@'] = api.paths.absSrcPath;
      memo.alias['@@'] = api.paths.absTmpPath;

      return memo;
    });
  }
};
