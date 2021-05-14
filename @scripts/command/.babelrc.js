module.exports = {
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-typescript', '@babel/plugin-proposal-class-properties'],
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  ignore: ['./src/template'],
}
