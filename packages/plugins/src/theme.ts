import type { DumiApi } from '@dumijs/core';
import { setOptions } from '@dumijs/core';
import { logger, winPath } from '@umijs/utils';
import fs from 'fs';
import path, { dirname } from 'path';
import { minify } from 'terser';
import getTheme from './utils/loader/theme/loader';
import { resolveProjectDep } from './utils/resolveProjectDep';

// initialize data-prefers-color attr for HTML tag
const COLOR_HEAD_SCP = `
(function () {
  var cache = localStorage.getItem('dumi:prefers-color');
  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var enums = ['light', 'dark', 'auto'];

  document.documentElement.setAttribute(
    'data-prefers-color',
    cache === enums[2]
      ? (isDark ? enums[1] : enums[0])
      : (enums.indexOf(cache) > -1 ? cache : enums[0])
  );
})();
`;

/**
 * plugin for alias dumi/theme module for export theme API
 */
export default (api: DumiApi) => {
  api.onStart(() => {
    logger.info('Using themeConfig Plugin');
  });
  api.describe({
    key: 'themeConfig',
    config: {
      schema(joi) {
        return joi.object();
      },
      default: {},
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  // share config with other source module via context
  api.modifyConfig((memo) => {
    setOptions('theme', memo.themeConfig);
    const pkgPath =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'dumi-theme-default',
      }) || dirname(require.resolve('dumi-theme-default/package.json'));
    // set alias for builtin default theme
    memo.alias['dumi-theme-default'] = pkgPath;

    // set alias for dumi theme api
    memo.alias['dumi/theme'] = path.join(__dirname, './utils/theme');
    return memo;
  });

  api.chainWebpack(async (memo) => {
    const theme = await getTheme();

    // compile theme path for npm linked theme
    if (fs.existsSync(theme.modulePath)) {
      memo.module
        .rule('js')
        .include.add(fs.realpathSync((await getTheme()).modulePath));
    }

    return memo;
  });

  // add head script to initialize prefers-color-schema for HTML tag
  api.addHTMLHeadScripts(async () => [
    { content: (await minify(COLOR_HEAD_SCP, { ecma: 5 })).code },
  ]);

  // write outer layout to tmp dir
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'dumi/layout.tsx',
      content: `import React from 'react';
import config from '@@/dumi/config';
import demos from '@@/dumi/demos';
import apis from '@@/dumi/apis';
import Layout from '${winPath(path.join(__dirname, './utils/theme/layout'))}';

export default (props) => <Layout {...props} config={config} demos={demos} apis={apis} />;
`,
    });
  });
};
