# 安装

> 在项目根目录执行，（node 版本 10.20.1）

```bash test
yarn
```

Note： Mac OS 下有可能出现的异常'vips/vips8' file not found

```bash
# 如果pnpm i过程中遇到sharp安装抛出的异常fatal error: 'vips/vips8' file not found
# 可以使用brew安装依赖vips图像处理库
brew install vips
# 然后再继续执行
pnpm i --force
```

> 在开发环境执行

```bash
yarn server:dev:bob
```

> 测试环境构建

```bash
yarn build:staging:clean
```

> 预发/UAT 环境构建

```bash
yarn build:uat:clean:bob
```

> 正式环境构建

```bash
yarn build:production:clean:bob
```

> 如果你需要单独启动一个模拟线上 nginx 的环境，可以这样

```bash
# 这个npm script一般用来验证dist目录下的资源是否按预期正确输出
# 注意修改lws.config.js下的baseURL指向api域名
yarn ws
```
