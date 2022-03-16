import { winPath } from '@umijs/utils';
import { DumiApi } from 'dumi';
import { join } from 'path';

export function withTmpPath(opts: {
  api: DumiApi;
  path: string;
  noPluginDir?: boolean;
}) {
  return winPath(
    join(
      opts.api.paths.absTmpPath,
      opts.api.plugin.key && !opts.noPluginDir
        ? `plugin-${opts.api.plugin.key}`
        : '',
      opts.path,
    ),
  );
}
