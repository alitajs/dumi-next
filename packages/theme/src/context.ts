import type { IThemeContext } from '@dumijs/core';
import React from 'react';

export default React.createContext<IThemeContext>({
  config: {
    mode: 'doc',
    title: '',
    navs: {},
    menus: {},
    locales: [],
    repository: { branch: 'master' },
    theme: {},
  },
  meta: { title: '' },
  menu: [],
  nav: [],
  base: '',
  routes: [],
  apis: {},
  demos: {},
});
