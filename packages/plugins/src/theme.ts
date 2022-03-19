import type { DumiApi } from '@dumijs/core';
import { setOptions } from '@dumijs/core';
import { logger } from '@umijs/utils';
import fs from 'fs';
import { dirname, join } from 'path';
import { minify } from 'terser';
import { DEFAULT_FRAMEWORK_NAME } from './constants';
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
 * plugin for alias @dumijs/theme module for export theme API
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
    const getPkgPath = (pkg: string) => {
      return (
        resolveProjectDep({
          pkg: api.pkg,
          cwd: api.cwd,
          dep: pkg,
        }) || dirname(require.resolve(`${pkg}/package.json`))
      );
    };

    // set alias for builtin default theme
    memo.alias['dumi-theme-default'] = getPkgPath('dumi-theme-default');

    // set alias for dumi theme api
    memo.alias['@dumijs/theme'] = getPkgPath('@dumijs/theme');
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
  api.onGenerateFiles(async () => {
    const theme = await getTheme();
    api.writeTmpFile({
      path: join(DEFAULT_FRAMEWORK_NAME, 'layout.tsx'),
      noPluginDir: true,
      content: `import React from 'react';
  
// import config from '@@/dumi/config';
// import demos from '@@/dumi/demos';
// import apis from '@@/dumi/apis';
import Layout from '@dumijs/theme/dist/layout';
import ThemeLayout from '${theme.layoutPaths._}';
import { useAppData, useLocation, Link,Outlet } from 'dumi';
// export default (props) => <Layout {...props} config={config} demos={demos} apis={apis} />;

export default () => {
  const location = useLocation();
  const config = {};
  const demos =[]
  const apis=[]
  return (
    <Layout location={location} config={config} demos={demos} apis={apis}>
     <ThemeLayout>
      <Outlet/>
      </ThemeLayout>
    </Layout>
  );
};
`,
    });
  });

  // api.addLayouts(() => {
  //   return [
  //     {
  //       id: 'dumi-layout',
  //       file: withTmpPath({
  //         api,
  //         noPluginDir: true,
  //         path: join(DEFAULT_FRAMEWORK_NAME, 'layout.tsx'),
  //       }),
  //     },
  //   ];
  // });
};
