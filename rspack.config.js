const { rspack } = require('@rspack/core');
const { defineConfig } = require('@rspack/cli');

const config = defineConfig({
  experiments: {
    css: true,
  },
  entry: {
    main: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                jsx: true,
              },
              transform: {
                react: {
                  pragma: 'React.createElement',
                  pragmaFrag: 'React.Fragment',
                  throwIfNamespace: true,
                  development: false,
                  useBuiltins: false,
                },
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.less$/i,
        type: 'css/auto',
        use: ['less-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.wasm', '.ts', '.js', '.jsx', '.tsx', '.css', '.less'],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: 'public/main.html',
    }),
  ],
});
module.exports = config;
