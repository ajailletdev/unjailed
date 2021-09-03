module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_BACKEND_URL,
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
        logLevel: 'debug' 
      },
    },
  }
}
