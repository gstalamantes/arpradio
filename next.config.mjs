/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@meshsdk/core",
      "@meshsdk/core-csl",
      "@meshsdk/core-cst",
      "@meshsdk/react",
    ],
  },
  reactStrictMode: true,
  webpack: function (config, options) {
    const { isServer } = options;
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    config.output = {
      ...config.output,
      webassemblyModuleFilename: isServer
        ? './../static/wasm/[modulehash].wasm'
        : 'static/wasm/[modulehash].wasm',
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
    return config;
  },
};

export default nextConfig;