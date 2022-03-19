/**
 * global route prefix in integrate mode
 */
const INTEGRATE_ROUTE_PREFIX = '/~docs';

export function prefix(oPath: string) {
  return `${INTEGRATE_ROUTE_PREFIX}${oPath}`.replace(/\/$/, '');
}
