export function getUrlDomainAndPath(urlString: string): {
  domain: string
  path: string
} {
  try {
    const url = new URL(urlString)
    let domain = url.hostname

    // Remove 'www.' prefix if it exists
    if (domain.startsWith('www.')) {
      domain = domain.slice(4)
    }

    return {
      domain,
      path: url.pathname === '/' ? '' : url.pathname,
    }
  } catch (error) {
    console.error('Invalid URL:', error)
    return {
      domain: '',
      path: '',
    }
  }
}
