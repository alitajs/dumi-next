import fs from 'fs';
import has from 'hast-util-has-property';
import is from 'hast-util-is-element';
import path from 'path';
import visit from 'unist-util-visit';
import url from 'url';
import type { IDumiElmNode, IDumiUnifiedTransformer } from '.';
import transformer from '..';
import {
  getFileContentByRegExp,
  getFileRangeLines,
} from '../../utils/getFileContent';
import { getModuleResolvePath } from '../../utils/moduleResolver';
import { isDynamicEnable } from '../utils';
import { getFilePathKey } from './slug';

/**
 * remark plugin for parse embed tag to external module
 */
export default function embed(): IDumiUnifiedTransformer {
  return (ast, vFile) => {
    visit<IDumiElmNode>(ast, 'element', (node, i, parent) => {
      if (is(node, 'embed') && has(node, 'src')) {
        const { src } = node.properties;
        const parsed = url.parse(src);
        const absPath = getModuleResolvePath({
          basePath: this.data('fileAbsPath'),
          sourcePath: parsed.pathname,
          extensions: [],
          silent: true,
        });

        if (absPath) {
          const masterKey =
            this.data('masterKey') || getFilePathKey(this.data('fileAbsPath'));
          const hash = decodeURIComponent(parsed.hash || '').replace('#', '');
          const query = new URLSearchParams();
          let content = fs.readFileSync(absPath, 'utf8').toString();

          query.append('master', masterKey);

          // generate loader query
          if (hash[0] === 'L') {
            query.append('range', hash);
            content = getFileRangeLines(content, hash);
          } else if (hash.startsWith('RE-')) {
            query.append('regexp', hash.substring(3));
            content = getFileContentByRegExp(
              content,
              hash.substring(3),
              absPath,
            );
          }

          const moduleReqPath = `${absPath}?${query}`;

          // process node via file type
          switch (path.extname(parsed.pathname)) {
            case '.md':
            default:
              // replace original node
              parent.children.splice(i, 1, {
                embed: true,
                type: 'element',
                tagName: 'React.Fragment',
                properties: {
                  // eslint-disable-next-line no-new-wrappers
                  children: new String(
                    `React.createElement(${
                      isDynamicEnable()
                        ? `dynamic({
                          loader: async () => import(/* webpackChunkName: "embedded_md" */ '${moduleReqPath}'),
                          loading: () => null,
                        })`
                        : `require('${moduleReqPath}').default`
                    })`,
                  ),
                },
                position: node.position,
              });

              vFile.data.slugs.push(
                ...transformer.markdown(content, absPath, {
                  cacheKey: moduleReqPath,
                  masterKey,
                }).meta.slugs,
              );
          }
        }
      }
    });
  };
}
