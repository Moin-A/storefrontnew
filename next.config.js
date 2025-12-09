// next.config.js

module.exports = {
    reactStrictMode: false,
    env:{
      API_URL: process.env.API_URL
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images: {      
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3001',
          pathname: '/rails/active_storage/**',
        },
        {
          protocol: 'http',
          hostname: '0.0.0.0',
          port: '3001',
          pathname: '/rails/active_storage/**',
        },
        {
          protocol: "https",
          hostname: "thestorefront.co.in",
          pathname: "/rails/**",
        },
        {
          protocol: "http",
          hostname: "thestorefront.co.in",
          pathname: "/rails/**",
        },
         {
          protocol: "https",
          hostname: "*.cloudfront.net",
        },
        {
          protocol: "http",
          hostname: "*.cloudfront.net",
        }
      ],
    },
  };