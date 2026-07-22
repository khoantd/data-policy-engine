/** Whether pathname matches a nav href (exact or nested prefix; `/` is exact-only). */
export function matchesNavHref(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Active when this href is the longest match among all nav hrefs.
 * Prevents parent items (e.g. `/policies`) from staying active on child routes
 * that have their own nav entry (e.g. `/policies/import`).
 */
export function isNavActive(
  pathname: string,
  href: string,
  allHrefs: string[],
): boolean {
  if (!matchesNavHref(pathname, href)) return false;
  let best = href;
  for (const candidate of allHrefs) {
    if (
      matchesNavHref(pathname, candidate) &&
      candidate.length > best.length
    ) {
      best = candidate;
    }
  }
  return best === href;
}
