import type { DumiApi, IDumiOpts, INavItem } from '@dumijs/core';
import { context as ctx, setOptions } from '@dumijs/core';
import { logger } from '@umijs/utils';
import { prefix } from './utils/prefix';

export default (api: DumiApi) => {
  api.onStart(() => {
    logger.info('Using Navs Plugin');
  });

  api.describe({
    key: 'navs',
    config: {
      schema(joi) {
        return joi.alternatives([joi.array(), joi.object()]);
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  // share config with other source module via context
  api.modifyConfig((memo) => {
    let navs: IDumiOpts['navs'];

    function navPrefix(items: INavItem[]) {
      return items.map((item) =>
        // compatible with null item
        item
          ? {
              ...item,
              path: /^(\w+:)?\/\/|^(mailto|tel):/.test(item.path)
                ? item.path
                : prefix(item.path),
              children: item.children
                ? navPrefix(item.children)
                : item.children,
            }
          : item,
      );
    }

    if (ctx.opts.isIntegrate && memo.navs) {
      // add integrate route prefix
      if (Array.isArray(memo.navs)) {
        // process single locale navs
        navs = navPrefix(memo.navs);
      } else {
        // process multiple locales navs
        navs = {};
        Object.keys(memo.navs).forEach((locale) => {
          navs[locale] = navPrefix(memo.navs[locale]);
        });
      }
    } else {
      // use user config
      navs = memo.navs;
    }
    setOptions('navs', navs);

    return memo;
  });
};
