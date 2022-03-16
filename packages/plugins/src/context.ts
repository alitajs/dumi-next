import type { DumiApi } from 'dumi';
import type {
  PropFilter,
  StaticPropFilter,
} from 'react-docgen-typescript-dumi-tmp/lib/parser';

export interface IMenuItem {
  path?: string;
  title: string;
  meta?: Record<string, any>;
  children?: IMenuItem[];
}

export interface INavItem {
  title: string;
  path?: string;
  [key: string]: any;
  children: INavItem[];
}

export type INav = Record<string, INavItem[]>;

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

const context: { umi?: DumiApi; opts?: IDumiOpts } = {};

/**
 * initialize context
 * @param umi   umi api
 * @param opts  dumi config
 */
export function init(umi: DumiApi, opts: IDumiOpts) {
  context.umi = umi;
  context.opts = opts;
}

/**
 * set dumi options in context
 * @param key   config key
 * @param value config value
 */
export function setOptions(key: keyof IDumiOpts, value: any) {
  (context!.opts![key] as any) = value;
}

export default context;