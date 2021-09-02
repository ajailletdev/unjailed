module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.SERVER_ADRESS,
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
        logLevel: 'debug' 
      },
    },
  }
}
