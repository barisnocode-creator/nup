/**
 * Centralized platform domain configuration.
 * Add new platform domains here — all routing logic imports from this file.
 */

export const PLATFORM_HOSTNAMES = [
  'localhost',
  'lovable.app',
  'lovable.dev',
  'webcontainer.io',
  'lovableproject.com',
  'nuppel.com',
  'www.nuppel.com',
];

/** Returns true if the given hostname belongs to the platform (not a customer custom domain). */
export function isPlatformDomain(hostname: string): boolean {
  return PLATFORM_HOSTNAMES.some(
    (ph) => hostname === ph || hostname.endsWith(`.${ph}`)
  );
}

/** Build the public URL for a published site, using the current host dynamically. */
export function buildPublicUrl(subdomain: string): string {
  const { protocol, host } = window.location;
  return `${protocol}//${host}/site/${subdomain}`;
}
