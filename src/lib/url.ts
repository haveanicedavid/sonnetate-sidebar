export function getUrlComponents(urlString: string): {
  baseUrl: string
  domain: string
  name: string
  path: string
} {
  try {
    const url = new URL(urlString)
    let domain = url.hostname
    let name = domain

    // Remove 'www.' prefix if it exists
    if (domain.startsWith('www.')) {
      domain = domain.slice(4)
      name = domain
    }

    // Handle subdomains and TLDs
    const parts = name.split('.')
    if (parts.length > 2) {
      // Check if it's a known TLD (e.g., co.uk, com.au)
      const knownTlds = ['co.uk', 'com.au', 'co.jp'] // Add more as needed
      const lastTwoParts = parts.slice(-2).join('.')
      if (knownTlds.includes(lastTwoParts)) {
        name = parts.slice(0, -2).join('.')
      } else {
        // It's likely a subdomain
        name = parts.slice(0, -1).join('.')
      }
    } else if (parts.length === 2) {
      name = parts[0]
    }

    return {
      baseUrl: `${url.protocol}//${url.host}`,
      domain,
      name,
      path: url.pathname === '/' ? '' : url.pathname,
    }
  } catch (error) {
    return {
      baseUrl: '',
      domain: '',
      name: '',
      path: '',
    }
  }
}
