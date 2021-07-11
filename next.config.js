module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)?', // Matches all pages
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW',
          }
        ]
      }
    ]
  }
}
