const path = require('path');
const Koa = require('koa');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const port = 8000;

// configs
const viewsPath = './build/views';
const staticPath = './build';

// template render
app.use(koaViews(path.join(__dirname, viewsPath), {
    extension: 'html'
}))

// static
app.use(koaStatic(
    path.join(__dirname, staticPath)
))

// router
router.redirect('/', '/index')
router.get('/index', async (ctx, next) => {
    await ctx.render('index')
})

app.use(router.routes())
   .use(router.allowedMethods())
   .listen(port);