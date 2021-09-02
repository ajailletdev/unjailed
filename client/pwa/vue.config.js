module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.NEXT_PUBLIC_SERVER_ADRESS,
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
        logLevel: 'debug' 
      },
    },
  }
}
