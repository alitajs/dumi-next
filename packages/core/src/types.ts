import type { AtomPropsDefinition } from 'dumi-assets-types';
import { FunctionComponent } from 'react';
import type {
  PropFilter,
  StaticPropFilter,
} from 'react-docgen-typescript-dumi-tmp/lib/parser';
import { IApi } from 'umi';

export type DumiApi = IApi & {};

// TODO: fix umi IConfig no find
export interface IConfig {}

export interface IAnalyzeCache {
  dependencies: {
    resolvePath: string;
    name: string;
    version: string;
    css?: string;
    peerDeps: { name: string; version: string; css?: string }[];
  }[];
  files: {
    resolvePath: string;
    requireStr: string;
    filename: string;
  }[];
}

export interface IDepAnalyzeResult {
  dependencies: Record<
    string,
    {
      version: string;
      css?: string;
    }
  >;
  files: Record<string, { import: string; fileAbsPath: string }>;
}
export interface IPreviewerComponentProps {
  title?: string;
  description?: string;
  sources:
    | {
        /**
         * self source code for demo
         * @note  jsx exsits definitely, tsx exists when the source code language is tsx
         */
        _: { jsx: string; tsx?: string };
      }
    | Record<
        string,
        {
          import: string;
          content: string;
          path?: string;
          tsx?: string;
        }
      >;
  /**
   * third-party dependencies of demo
   */
  dependencies: IDepAnalyzeResult['dependencies'];
  /**
   * global identifier for demo
   */
  identifier: string;
  /**
   * the component which demo belongs to
   */
  componentName?: string;
  /**
   * motions of current demo, for snapshot or preview
   */
  motions?: string[];
  /**
   * mark demo as debug demo, will be discarded in production mode
   */
  debug?: true;
  [key: string]: any;
}

export interface IApiComponentProps {
  /**
   * api data identifier
   * @note  it is the component identifier by default
   *        will fallback to the src path on <code> element if component identifier is not available
   */
  identifier: string;
  /**
   * which export should be displayed
   */
  export: string;
  /**
   * whether the title is hidden when compiling
   */
  hideTitle: boolean;
}

export type ArgsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer U
) => any
  ? U
  : never;
export interface IMenuItem {
  path?: string;
  title: string;
  meta?: Record<string, any>;
  children?: IMenuItem[];
}
export type IMenu = Record<
  string,
  {
    // path level
    '*'?: IMenuItem[];
    [key: string]: IMenuItem[];
  }
>;
export interface IComponent extends FunctionComponent {
  getInitialProps?: Function;
  preload?: () => Promise<any>;
}
export interface IRoute {
  path?: string;
  exact?: boolean;
  redirect?: string;
  component?: IComponent | string;
  routes?: IRoute[];
  key?: any;
  strict?: boolean;
  sensitive?: boolean;
  wrappers?: any[];
  [k: string]: any;
}
export interface IRouteComponentProps<
  Params extends {
    [K in keyof Params]?: string;
  } = {},
  Query extends {
    [K in keyof Query]?: string;
  } = {},
> {
  children: JSX.Element;
  location: Location & {
    query: Query;
  };
  route: IRoute;
  routes: IRoute[];
  history: History;
}

export interface INavItem {
  title: string;
  path?: string;
  [key: string]: any;
  children: INavItem[];
}

export type INav = Record<string, INavItem[]>;
export interface ILocale {
  name: string;
  label: string;
}

export type IApiDefinition = AtomPropsDefinition;

export interface IMenuItem {
  path?: string;
  title: string;
  meta?: Record<string, any>;
  children?: IMenuItem[];
}

export interface IStaticPropFilter extends StaticPropFilter {
  /**
   * skip props which parsed from node_modules
   */
  skipNodeModules?: boolean;
}
export interface IDumiOpts {
  /**
   * site title
   * @default   package name
   */
  title: string;
  /**
   * site logo
   * @default   Umi logo
   */
  logo?: string | boolean;
  /**
   * render mode
   * @default   doc
   * @refer     https://d.umijs.org/guide/mode
   */
  mode: 'doc' | 'site';
  /**
   * site description
   * @note  only available in site mode
   */
  description?: string;
  /**
   * site languages
   * @default  [['en-US', 'EN'], ['zh-CN', '中文']]
   */
  locales: [string, string][];
  /**
   * resolve config
   */
  resolve: {
    /**
     * which code block language will be rendered as React component
     * @default   ['jsx', 'tsx']
     */
    previewLangs: string[];
    /**
     * configure the markdown directory for dumi searching
     * @default   ['docs', 'src'] or ['docs', 'packages/pkg/src']
     */
    includes: string[];
    /**
     * configure the markdown directory for dumi exclude
     * @note  like gitignore spec, http://git-scm.com/docs/gitignore
     */
    excludes: string[];
    /**
     * TBD
     */
    examples: string[];
    /**
     * Should we treat previewLangs codeblock as demo component
     */
    passivePreview: boolean;
  };
  /**
   * customize the side menu
   * @note  only available in site mode
   */
  menus?: Record<string, IMenuItem[]>;
  /**
   * customize the navigations
   * @note  only available in site mode
   */
  navs?: INav | INavItem[];
  /**
   * enable algolia searching
   */
  algolia?: {
    appId?: string;
    apiKey: string;
    indexName: string;
    debug?: boolean;
  };
  /**
   * is integrate mode
   * @note  if enter interate mode, doc site will append in /~docs route in development
   */
  isIntegrate: boolean;
  /**
   * theme config
   */
  theme: Record<string, any>;
  /**
   * apiParser config
   */
  apiParser: {
    propFilter?: IStaticPropFilter | PropFilter;
  };
  /**
   * configure how html is output
   */
  // exportStatic?: IConfig['exportStatic'];
}

export interface IThemeContext {
  /**
   * documentation config
   */
  config: {
    /**
     * mode type
     */
    mode: 'doc' | 'site';
    /**
     * site title
     */
    title: IDumiOpts['title'];
    /**
     * site description
     */
    description?: IDumiOpts['description'];
    /**
     * documentation repository URL
     */
    repository: {
      url?: string;
      branch: string;
      platform?: string;
    };
    /**
     * logo image URL
     */
    logo?: IDumiOpts['logo'];
    /**
     * navigation configurations
     */
    navs: INav;
    /**
     * sidemenu configurations
     */
    menus: IMenu;
    /**
     * locale configurations
     */
    locales: ILocale[];
    /**
     * algolia configurations
     */
    algolia?: IDumiOpts['algolia'];
    /**
     * theme config
     */
    theme: IDumiOpts['theme'];
    /**
     * configure how html is output
     */
    // TODO: UMI4 exportStatic
    // exportStatic?: IConfig['exportStatic'];
  };
  /**
   * the meta information of current route
   */
  meta: {
    /**
     * page title
     */
    title: string;
    /**
     * control sidemenu display
     */
    sidemenu?: boolean;
    /**
     * control toc position in page
     */
    toc?: false | 'content' | 'menu';
    // TODO: https://d.umijs.org/config/frontmatter#markdown-%E6%94%AF%E6%8C%81%E7%9A%84-frontmatter-%E9%85%8D%E7%BD%AE%E9%A1%B9
    [key: string]: any;
  };
  /**
   * current locale
   */
  locale?: string;
  /**
   * current menu
   */
  menu: IMenu['locale']['path'];
  /**
   * current nav
   */
  nav: INav['locale'];
  /**
   * base path
   */
  base: string;
  /**
   * documentation routes
   */
  routes: (IRoute & { meta: any })[];
  /**
   * all demos data
   */
  demos: Record<
    string,
    {
      component: React.ComponentType;
      previewerProps: IPreviewerComponentProps;
    }
  >;
  /**
   * all parsed api data
   */
  apis: Record<string, IApiDefinition>;
}
