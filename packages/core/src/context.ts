import type { DumiApi, IDumiOpts } from './types';

const context: { umi?: DumiApi; opts?: IDumiOpts } = (global as any)
  .context ?? { opts: {} };

if (!(global as any).context) {
  (global as any).context = context;
}

/**
 * initialize context
 * @param umi   umi api
 * @param opts  dumi config
 */
export function init(umi: DumiApi, opts: IDumiOpts) {
  context.umi = umi;
  // TODO: umi plugin 加载顺序？？ init 不是第一个进这里的
  context.opts = { ...context.opts, ...opts };
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
