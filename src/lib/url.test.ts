import { describe, expect, test } from 'vitest'
import { getUrlComponents } from './url'

describe('getUrlComponents', () => {
  test('handles URL with www and path', () => {
    const result = getUrlComponents('https://www.example.com/path/to/page')
    expect(result).toEqual({
      baseUrl: 'https://www.example.com',
      domain: 'example.com',
      name: 'example',
      path: '/path/to/page'
    })
  })

  test('handles URL without www', () => {
    const result = getUrlComponents('http://example.org/path')
    expect(result).toEqual({
      baseUrl: 'http://example.org',
      domain: 'example.org',
      name: 'example',
      path: '/path'
    })
  })

  test('handles URL with no path', () => {
    const result = getUrlComponents('https://example.net')
    expect(result).toEqual({
      baseUrl: 'https://example.net',
      domain: 'example.net',
      name: 'example',
      path: ''
    })
  })

  test('handles URL with non-standard TLD', () => {
    const result = getUrlComponents('https://example.co.uk/path')
    expect(result).toEqual({
      baseUrl: 'https://example.co.uk',
      domain: 'example.co.uk',
      name: 'example',
      path: '/path'
    })
  })

  test('handles URL with subdomain', () => {
    const result = getUrlComponents('https://blog.example.com/post')
    expect(result).toEqual({
      baseUrl: 'https://blog.example.com',
      domain: 'blog.example.com',
      name: 'blog.example',
      path: '/post'
    })
  })

  test('handles URL with multiple subdomains', () => {
    const result = getUrlComponents('https://sub1.sub2.example.com/page')
    expect(result).toEqual({
      baseUrl: 'https://sub1.sub2.example.com',
      domain: 'sub1.sub2.example.com',
      name: 'sub1.sub2.example',
      path: '/page'
    })
  })

  test('handles URL with subdomain and non-standard TLD', () => {
    const result = getUrlComponents('https://blog.example.co.uk/post')
    expect(result).toEqual({
      baseUrl: 'https://blog.example.co.uk',
      domain: 'blog.example.co.uk',
      name: 'blog.example',
      path: '/post'
    })
  })

  test('handles invalid URL', () => {
    const result = getUrlComponents('not-a-valid-url')
    expect(result).toEqual({
      baseUrl: '',
      domain: '',
      name: '',
      path: ''
    })
  })
})
