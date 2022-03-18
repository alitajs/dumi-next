import { context, Link } from '@dumijs/theme';
// @ts-ignore
import { history } from 'dumi';
import type { FC } from 'react';
import React, { useContext } from 'react';
import './LocaleSelect.less';

const LocaleSelect: FC<{ location: any }> = ({ location }) => {
  const {
    base,
    locale,
    config: { locales },
  } = useContext(context);
  const firstDiffLocale = locales.find(({ name }) => name !== locale);

  function getLocaleTogglePath(target: string) {
    const baseWithoutLocale = base.replace(`/${locale}`, '');
    const pathnameWithoutLocale =
      location.pathname.replace(
        new RegExp(`^${base}(/|$)`),
        `${baseWithoutLocale}$1`,
      ) || '/';

    // append locale prefix to path if it is not the default locale
    if (target !== locales[0].name) {
      // compatiable with integrate route prefix /~docs
      const routePrefix = `${baseWithoutLocale}/${target}`.replace(/\/\//, '/');
      const pathnameWithoutBase = location.pathname.replace(
        // to avoid stripped the first /
        base.replace(/^\/$/, '//'),
        '',
      );

      return `${routePrefix}${pathnameWithoutBase}`.replace(/\/$/, '');
    }

    return pathnameWithoutLocale;
  }

  return firstDiffLocale ? (
    <div
      className="__dumi-default-locale-select"
      data-locale-count={locales.length}
    >
      {locales.length > 2 ? (
        <select
          value={locale}
          onChange={(ev) => history.push(getLocaleTogglePath(ev.target.value))}
        >
          {locales.map((localeItem) => (
            <option value={localeItem.name} key={localeItem.name}>
              {localeItem.label}
            </option>
          ))}
        </select>
      ) : (
        <Link to={getLocaleTogglePath(firstDiffLocale.name)}>
          {firstDiffLocale.label}
        </Link>
      )}
    </div>
  ) : null;
};

export default LocaleSelect;
