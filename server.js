const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path');
const historyApiFallback = require('koa-history-api-fallback');
const proxy = require('koa2-proxy-middleware');

const PORT = process.argv[2];
const BACKEND_URL = process.argv[3];
const home = serve(path.join(__dirname) + '/build');

const options = {
  targets: {
    '/api/(.*)': {
      target: BACKEND_URL,
      changeOrigin: true,
      pathRewrite: {
        '/api': '/api', // rewrite path
      }
    },
  }
}

console.log('PORT: ' + PORT)
console.log('BACKEND_URL: ' + BACKEND_URL)

app.use(historyApiFallback());
app.use(proxy(options));
app.use(home); 
app.listen(PORT, () => {
  console.log('server started')
});