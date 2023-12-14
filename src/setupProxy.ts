import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = (app: any) => {
  app.use(
    '/ap/**',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};

module.exports = proxy;
