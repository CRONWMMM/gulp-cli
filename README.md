# 📦 gulp-cli

## 项目介绍：

目前的SPA应用基本都有框架自带的一套脚手架工具自动生成，但是对于非SPA应用这种构建工具就很稀缺，
就算有的那些个人感觉并不好用，主要是对 ES6/7语法/模块化 的支持程度并不好，无法使用原生的ES6和
import静态编译。针对这一现状，我写了一套 gulp + webpack 自动构建工具，主要针对那些非 SPA的
应用构建。

---

### 功能介绍：
1.将 gulp 任务流以配置文件的形式提取出来，尽量最大范围实现灵活可配置性。
2.相比于网上别的开源 gulp 脚手架，实现了对 ES6 写法的全面支持，无论是 语法、API 还是 import模块化引用，目前可能并未支持ES7，后面可以加上，包括ESlint检查工具 和单元测试，后面也可以加上。
3.由于实现了ES6模块静态编译，所有libs全是从node_modules里找的，所以不需要用到bower。
4.所有js的入口文件在webpack文件里配置完成以后，不需要在 html 页面里声明，webpack会自动inject
5.样式文件可同时支持 css/sass/less/stylus 等写法，在配置文件中定义即可。
6.autoPrefixer自动补全样式前缀。
7.样式文件、脚本文件等静态资源均通过md5重命名，防止浏览器缓存
8.更方便的 link-href img-src background-imageURL 等路径地址配置，只要在项目中写资源名称，例如 index.css  logo.jpg  脚手架会根据配置文件自动补全路径，如果是网络资源，正常写 http://开头的绝对路径即可。


### Getting started


1. Clone the repository

```
git clone https://github.com/CRONWMMM/gulp-cli.git
cd gulp-cli
```

2. Install with npm

```
npm install
```

3. Run dev

```
npm run dev
```

4. Run build

```
npm run build
```
