import { FunctionComponent } from 'react';
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
