import fs from 'fs';
import has from 'hast-util-has-property';
import is from 'hast-util-is-element';
import path from 'path';
import visit from 'unist-util-visit';
import type { IDumiElmNode, IDumiUnifiedTransformer } from '.';
import { getModuleResolvePath } from '../../utils/moduleResolver';
import { previewerTransforms } from './previewer';
import { parseElmAttrToProps } from './utils';

/**
 * remark plugin for parse code tag to external demo
 */
export default function code(): IDumiUnifiedTransformer {
  return (ast) => {
    visit<IDumiElmNode>(ast, 'element', (node, index, parent) => {
      if (is(node, 'code') && has(node, 'src')) {
        const hasCustomTransformer = previewerTransforms.length > 1;
        const { src, ...attrs } = node.properties;
        const props = {
          source: '',
          lang: path.extname(src).slice(1),
          filePath: path.join(path.dirname(this.data('fileAbsPath')), src),
        };
        const parsedAttrs = parseElmAttrToProps(attrs);

        try {
          props.filePath = getModuleResolvePath({
            basePath: this.data('fileAbsPath'),
            sourcePath: src,
            // allow set unresolved src then resolve by custom transformer
            silent: hasCustomTransformer,
            // allow ts/js demo if there has custom compiletime transformer
            ...(hasCustomTransformer ? {} : { extensions: ['.tsx', '.jsx'] }),
          });
          props.source = fs.readFileSync(props.filePath, 'utf8').toString();
          props.lang = path.extname(props.filePath).slice(1);
        } catch (err) {
          /* istanbul ignore next */
          if (!hasCustomTransformer) {
            throw err;
          }
        }

        // replace original node
        parent.children.splice(index, 1, {
          type: 'element',
          tagName: 'div',
          position: node.position,
          properties: {
            type: 'previewer',
            ...props,
            src,
            meta: {
              ...parsedAttrs,
            },
          },
        });
      }
    });
  };
}
