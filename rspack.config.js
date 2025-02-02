const { rspack } = require('@rspack/core');
const { defineConfig } = require('@rspack/cli');

const config = defineConfig({
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
        type: 'javascript/auto',
        use: [rspack.CssExtractRspackPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/i,
        type: 'javascript/auto',
        use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
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
    new rspack.CssExtractRspackPlugin({}),
  ],
});
module.exports = config;
