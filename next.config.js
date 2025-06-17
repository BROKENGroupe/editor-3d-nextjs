/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(vert|frag)$/,
      use: 'raw-loader'
    });
    return config;
  }
}

module.exports = nextConfig