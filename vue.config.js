module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.10.5.130:12020",
        //1222为端口号，用邱贻可后台的为12222
        changeOrigin: true,
        secure: false,
        ws: true,
        pathRewrite: {
          "^/api": "http://10.10.5.130:12020/api"
          // 18762
        }
      }
    }
  }
};