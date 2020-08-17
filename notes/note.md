# 手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法

## Vue.js 基础回顾

### vue 两种基本结构

```html
    <div id="app">
        <p>名称：{{ company.name }}</p>
        <p>地址：{{ company.address }}</p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

    <script>
        new Vue({
            el: '#app',
            data: {
                company: {
                    name: 'cccc',
                    address: 'casdfs'
                }
            }
        })
    </script>
```

```html
    <div id="app">
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

    <script>
        new Vue({
            data: {
                company: {
                    name: 'csf',
                    address: 'csda'
                }
            },
            render(h) {
                return h('div', [
                    h('p', '名称：' + this.company.name),
                    h('p', '地址：' + this.company.address)
                ])
            }
        }).$mount('#app')
    </script>
```

### Vue.js 语法和概念

- 插值表达式
- 指令
- 计算属性和侦听器
- Class 和 Style 绑定
- 条件渲染/列表渲染
- 表单输入绑定 v-model
- 组件——可复用的 vue 实例
- 插槽
- 插件——vuex，vue-router 等
- 混入 mixin——如果多个组件都有相同的选项就可以使用混入的方式，把相同选项合并，让代码重用
- 深入响应式原理
- 不同构件版本的 Vue

## Vue Router 原理分析与实现

### Vue Router 基础回顾

#### 基础使用步骤：

- 创建与路由相关的组件(试图)
- 注册路由插件，调用Vue.use(VueRouter)
- 创建 router 对象，创建时要配置路由规则 const router = new VueRouter({routers})
- 在创建 Vue 实例时注册 router 对象
- 通过 <router-view 设置占位，当路径匹配成功后会替换router-view 这个位置
- 通过 router-link 创建链接

#### 动态路由传参

```html
  <div>
    <!-- 方式1：通过当前路由规则，获取数据,这种方式不太好，因为当前组件强依赖于路由 -->
    通过当前路由规则获取：{{ $route.params.id }}
    <br />
    <!-- 方式2：路由规则中开启 props 传参 -->
    通过开启 props 获取：{{ id }}
  </div>
```

```js
// router/index.js
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    // 开启 props，会把 URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
]
```

推荐使用 props 的方式，相当于组件里的属性，不依赖于路由的规则

#### 嵌套路由

当多个路由组件都有相同的内容，可以把相同的内容提取到一个公共组件当中（例如固定的 layout ）

#### 编程式导航

$router.push()，$router.replace()，$router.go() 方法

replace() 不会记录当前历史

### Hash 模式和 History 模式

变现形式的区别

- Hash 模式，带有 #，# 后面的内容作为路由地址，可以通过 ？携带参数
  - https://music.163.com/#/playlist?id=xxxxxxxx
- History 模式
  - https://music.163.com/playlist/xxxxxxxx

原理的区别

- Hash 模式是基于锚点，以及 onhashchange 事件。通过锚点的值作为路由地址，当地址发生变化后，触发 onhashchange 事件，然后根据路径决定页面上的内容
- History 模式是基于 HTML5 中的 History API
  - history.pushState() IE 10 以后才支持，于 history.push() 不同的是它不会发送 Http 请求，只会改变地址栏中的地址，并且记录到历史记录中
  - history.replaceState()

### History 模式

#### History 模式的使用

- History 需要服务器的支持
- 单页面应用中，服务端不存在 http://www.testurl.com/login 这样的地址，会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的 index.html

#### nginx 服务器配置

- 从官网下载 nginx 压缩包

- 把压缩包解压都目录

- 使用命令行进入对应目录

- 启动 nginx

  ```bash
  # 启动
  $ start nginx
  # 重启
  $ nginx -s reload
  # 停止
  $ nginx -s stop
  ```

```
# nginx.conf
        location / {
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
```



### 模拟实现 Vue Router

#### Vue 的构建版本

- 运行时版：不支持 template 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版本大 10K 左右，程序运行的时候把模板转换成 render 函数

## 响应式原理分析与实现

准备工作

- 数据驱动
- 响应式的核心原理
- 发布订阅模式和观察者模式

### 数据驱动

- 数据响应式、双向绑定、数据驱动
- 数据响应式
  - 数据模型仅仅是普通的 JavaScript 对象，而当我们修改数据时，视图会进行更新，避免了繁琐的 DOM 操作，提高开发效率
- 双向绑定
  - 数据改变，视图改变；视图改变，数据也随之改变
  - 可以使用 v-model 在表单元素上创建双向数据绑定
- 数据驱动是 Vue 最独特的特性之一
  - 开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图的

### 数据响应式的核心原理

#### Vue 2.x

- [Vue 2.x 深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
- [MDN-Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- 浏览器兼容 IE8 以上（不兼容 IE8）

```js
    // 模拟 Vue 中的 data 选项
    let data = {
      msg: 'hello',
      count: 10
    }

    // 模拟 Vue 的实例
    let vm = {}

    proxyData(data)

    function proxyData(data) {
      // 遍历 data 对象的所有属性
      Object.keys(data).forEach(key => {
        // 把 data 中的属性，转换成 vm 的 setter/setter
        Object.defineProperty(vm, key, {
          enumerable: true,
          configurable: true,
          get () {
            console.log('get: ', key, data[key])
            return data[key]
          },
          set (newValue) {
            console.log('set: ', key, newValue)
            if (newValue === data[key]) {
              return
            }
            data[key] = newValue
            // 数据更改，更新 DOM 的值
            document.querySelector('#app').textContent = data[key]
          }
        })
      })
    }

    // 测试
    vm.msg = 'Hello World'
    console.log(vm.msg)
```

- 如果有一个对象中多个属性需要转换 getter/setter 如何处理？

  遍历对象中的所有属性，然后进行转换

  ```js
  	// 模拟 Vue 中的 data 选项
      let data = {
        msg: 'hello',
        count: 10
      }
  
      // 模拟 Vue 的实例
      let vm = {}
  
      proxyData(data)
  
      // 把多个属性都匹配上对应的 getter 和 setter
      function proxyData(data) {
        // 遍历 data 对象的所有属性
        Object.keys(data).forEach(key => {
          // 把 data 中的属性，转换成 vm 的 setter/getter
          Object.defineProperty(vm, key, {
            enumerable: true,
            configurable: true,
            get () {
              console.log('get: ', key, data[key])
              return data[key]
            },
            set (newValue) {
              console.log('set: ', key, newValue)
              if (newValue === data[key]) {
                return
              }
              data[key] = newValue
              // 数据更改，更新 DOM 的值
              document.querySelector('#app').textContent = data[key]
            }
          })
        })
      }
  
      // 测试
      vm.msg = 'Hello kkkkk'
      console.log(vm.msg)
  ```

#### Vue3.x

- [MDN-Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- 直接监听对象，而非属性，且代理的是整个对象
- ES6 中新增，IE 不支持，性能由浏览器优化

```js
    // 模拟 Vue 中的 data 选项
    let data = {
      msg: 'hello',
      count: 0
    }

    // 模拟 Vue 实例
    let vm = new Proxy(data, {
      // 执行代理行为的函数
      // 当访问 vm 的成员会执行
      get (target, key) {
        console.log('get, key: ', key, target[key])
        return target[key]
      },
      // 当设置 vm 的成员会执行
      set (target, key, newValue) {
        console.log('set, key: ', key, newValue)
        if (target[key] === newValue) {
          return
        }
        target[key] = newValue
        document.querySelector('#app').textContent = target[key]
      }
    })

    // 测试
    vm.msg = 'hello  kkkk'
    console.log(vm.msg)
```

### 发布订阅模式和观察者模式

发布订阅模式和观察者模式的区别是观察者模式没有事件中心，只有发布者（目标）和订阅者（观察者），并且发布者需要知道订阅者的存在

#### 发布/订阅模式

- 发布/订阅模式

  - 订阅者
  - 发布者
  - 信号中心

  > 我们假定，存在一个“信号中心”，某个任务执行完成，就向信号中心“发布”（publish）一个信号，其他任务可以向信号中心”订阅“（subscribe）这个信号，从而知道什么时候自己可以开始执行。**这就叫做“发布/订阅”模式（publish-subscribe pattern）**

- Vue 的自定义事件

  - [$dispatch和$broadcast](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

    ```js
        // Vue 自定义事件
        let vm = new Vue()
        // { 'click': [fn1, fn2], 'change': [fn] }
    
        // 注册事件(订阅消息)
        vm.$on('dataChange', () => {
          console.log('dataChange')
        })
    
        vm.$on('dataChange', () => {
          console.log('dataChange1')
        })
        // 触发事件(发布消息)
        vm.$emit('dataChange')
    ```

  - 兄弟组件通信过程

    ```js
    // eventBus.js
    // 事件中心
    let eventHub = new Vue()
    
    // ComponentA.vue
    // 发布者
    addTodo: function () {
    	// 发布消息（事件）
    	eventHub.$emit('add-todo', { text: this.newTodoText })
    	this.newTodoText = ''
    }
    
    // ComponentB.vue
    // 订阅者
    created: function () {
    	// 订阅消息（事件）
    	eventHub.$on('add-todo', this.addTodo)
    }
    ```

  - 模拟 Vue 自定义事件的实现

    ```js
        // 事件触发器
        class EventEmitter {
          constructor() {
            // 记录事件，以及事件对应的处理函数
            // { 'click': [fn1, fn2], 'change': [fn] }
            this.subs = Object.create(null)
          }
          // 注册事件
          $on(eventType, handler) {
            this.subs[eventType] = this.subs[eventType] || []
            this.subs[eventType].push(handler)
          }
    
          // 触发事件
          $emit(eventType) {
            if (this.subs[eventType]) {
              this.subs[eventType].forEach(handler => {
                handler()
              })
            }
          }
        }
    
        // 测试
        let em = new EventEmitter()
        em.$on('click', () => {
          console.log('click1')
        })
    
        em.$on('click', () => {
          console.log('click2')
        })
    
        em.$emit('click')
    ```

#### 观察者模式

- 观察者（订阅者）—— Watcher
  - update(): 当事件发生时，具体要做的事情
- 目标（发布者）—— Dep
  - subs 数组：存储所有观察者
  - addSub()：添加观察者
  - notif()：当事件发生，调用所有观察者的update() 方法
- 没有事件中心

#### 总结

- **观察者模式**是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的
- **发布/订阅模式**由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在

### Vue 响应式原理模拟

#### 整体分析

- Vue 基本结构
- 打印 Vue 实例观察
- 整体结构
- Vue
  - 把 data 中的成员注入到 Vue 实例，并且把 data 中的成员转成 getter/setter
- Observer
  - 能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知 Dep
- Compiler
  - 解析每个元素中的指令/插值表达式，并替换成相应的数据
- Dep
  - 添加观察者（watcher），当数据变化通知所有观察者
- Watcher
  - 数据变化更新视图

#### Vue

- 功能
  - 负责接收初始化的参数（选项）
  - 负责把 data 中的属性注入到 Vue 实例，转换成 getter/setter
  - 负责调用 observer 监听 data 中所有属性的变化
  - 负责调用 compiler 解析指令/插值表达式
- 结构
  - Vue,+$options +$el +$data, - _proxyData()

#### Observer

- 功能
  - 负责把 data 选项中的属性转换成响应式数据
  - data 中的某个属性也是对象，把该属性转换成响应式数据
  - 数据变化发送通知
- 结构
  - Observer，+walk(data) +defineReactive(data,key,value)

#### Compiler

- 功能
  - 负责编译模板，解析指令/插值表达式
  - 负责页面的首次渲染
  - 当数据变化后重新渲染视图
- 结构
  - Compiler, +el +VM，+compile(el) +compileElement(node) +compileText(node) +idDirective(attrName) +isTextNode(node) +isElementNode(node)

#### Dep(Dependency)

- 功能
  - 收集依赖，添加观察者(watcher)
  - 通知所有观察者
- 结构
  - Dep，+subs，+addSub(sub)，+notify()

#### Watcher

- 功能
  - 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
  - 自身实例化的时候往 dep 对象中添加自己
- 结构
  - Watcher，+vm +key +cb +oldValue，+update()

### 调试

通过调试加深对代码的理解

1. 调试页面首次渲染的过程
2. 调式数据改变更新视图的过程

### 总结

- 问题

  - 给属性重新赋值成对象，是否是响应式的？

    是

  - 给 Vue 实例新增一个成员是否是响应式的？

    不是

## Virtual Dom 的实现原理以及虚拟 DOM 库 Snabbdom 源码解析

### 什么是虚拟 DOM （Virtual Dom）

- Virtual DOM(虚拟 DOM)，是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM

- 真实 DOM 成员，成员非常多，创建成本高

  ```js
  let element = document.querySelector('#app')
  let s = ''
  for (var key in element) {
  	s += key + ','
  }
  console.log(s)
  // 打印结果,成员非常多
  ...
  ```

- 可以使用 Virtual DOM 来描述真实 DOM，创建虚拟 DOM 的开销比创建真实 DOM 的开销小很多，示例.

  ```js
  {
  	sel: 'div',
  	data: {},
  	children: undefined,
  	text: 'hello'
  	elm: undefined,
  	key: undefined
  }
  ```

### 为什么使用 Virtual DOM

- 手动操作 DOM 比较麻烦，还需要考虑浏览器兼容性问题，虽然有 jQuery 等库简化 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升
- 为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题
- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了
- Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述 DOM，Virtual DOM 内部将弄清楚如何有效（diff）的更新 DOM
- 参考 github 上 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 的描述
  - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
  - 通过比较前后两次状态的差异更新真实 DOM

### 虚拟 DOM 的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 除了渲染 DOM 以外，还可以实现 SSR（Nuxt.js/Next.js）、原生应用（Weex/React Native）、小程序（mpvue/uni-app）等

### Virtual DOM 库

- [Snabbdom](https://github.com/snabbdom/snabbdom)
  - Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
  - 大约 200 SLOC（single line of code）
  - 通过模块可扩展
  - 源码使用 TypeScript 开发
  - 最快的 Virtual DOM 之一
- [virtural-dom](https://github.com/Matt-Esch/virtual-dom)

### Snabbdom 基本使用

#### 创建项目

- 打包工具为了方便使用 parcel

- 创建项目，并安装 parcel

  ```bash
  # 创建项目目录
  md snabbdom-demo
  # 进入项目目录
  cd snabbdom-demo
  # 创建 package.json
  yarn init -y
  # 本地安装 parcel
  yarn add parcel-bundler
  ```

- 配置package.josn 的 scripts

  ```json
    "scripts": {
      "dev": "parcel index.html --open",
      "build": "parcel build index.html"
    },
  ```

- 创建目录结构

  ```
  | index.html
  | package.json
  |-src
  	01-basicusage.js
  ```


#### 导入 Snabbdom

- 安装

  ```bash
  $ yarn add snabbdom
  ```

- 导入

  ```js
  import { init, h, thunk } from 'snabbdom'
  ```

- Snabbdom 的核心仅提供最基本的功能，只导出了init()、h()、thunk()三个函数

  - init() 是一个高阶函数，返回 patch()

  - h() 函数返回虚拟节点的 VNode, 这个函数在使用 vue.js 时见过

    ```js
    new Vue({
    	router,
    	store,
    	render: h => h(App)
    }).$mount('#app')
    ```

  - thunk() 是一种优化策略，可以在处理不可变数据时使用

### Snabbdom 中的模块

Snabbdom 的核心库并不能处理元素的属性/样式/事件等，如果需要处理的话，可以使用模块

#### 常用模块

官方提供了 6 个模块

- attributes
  - 设置 DOM 元素的属性，使用 setAttribute()
  - 处理布尔类型的属性
- props
  - 和 atqiehuanleiyanghsitributes 模块相似，设置 DOM 元素的属性 element[attr] = value
  - 不处理布尔类型的属性
- class
  - 切换类样式
  - 注意：给元素设置类样式是通过 sel 选择器
- dataset
  - 设置 data-* 的自定义属性
- eventlisteners
  - 注册和移出事件
- style
  - 设置行内样式，支持动画
  - dlayed/remove/destory

#### 模块使用

模块使用步骤

- 导入需要的模块
- init() 中注册模块
- 使用 h() 函数创建 VNode 的时候，可以把第二个参数设置为对象，其他参数往后移

### Snabbdom 源码解析

#### 概述

##### 如何学习源码

- 先宏观了解
- 带着目标看源码
- 看源码的过程要不求甚解
- 调试
- 参考资料

##### Snabbdom 的核心

- 使用 h() 函数创建 JavaScript 对象（VNode）描述真实DOM
- init() 设置模块，创建 patch()
- patch() 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树上

##### Snabbdom 源码

- 源码地址：https://github.com/snabbdom/snabbdom
- src 目录结构

#### h 函数

- h() 函数介绍

  - 在使用 Vue 的时候见过 h() 函数
  - h() 函数最早见于 hyperscript ，使用 JavaScript 创建超文本
  - Snabbdom 中的 h() 函数不是用来创建超文本，而是创建 VNode

- 函数重载

  - 概念

    - **参数个数**或**类型**不同的函数
    - JavaScript 中没有重载的概念
    - TypeScript 中有重载，不过重载的实现还是通过代码调整参数

  - 重载的示意

    ```js
    function add(a, b) {
    	console.log(a + b)
    }
    
    function add(a, b, c) {
    	console.log(a + b + c)
    }
    
    add(1, 2)
    add(1, 2, 3)
    ```

  - 源码位置：src/h.ts

#### Snbbdom VNode 渲染真实 DOM

patch 的整体过程

- patch(oldVnode, newVnode)
- 打补丁，把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理的旧节点
- 对比新旧 VNode 是否是相同节点（节点的 key 和 sel 相同）
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容
- 如果新的 VNode 有 children ，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层级比较

#### updateChildren

- 功能
  - diff 算法的核心，对比新旧节点的 children，更新 DOM
- 执行过程
  - 要对比两棵树的差异，我们可以取第一棵树的每一个节点依次和第二棵树的每一个节点比较，但是这样的时间复杂度为O(n^k)
  - 在 DOM 操作的时候，我们很少很少会把一个父节点移动/更新到某一个子节点
  - 因此只需要找**同级别**的**子节点**依次**比较**，然后再找下一级别的节点比较，这样算法的时间复杂度为O(n)
  - 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引
  - 在对**开始和结束节点**比较的时候，总共有四种情况：
    - oldStartVnode / newStartVnode (旧开始节点/新开始节点)
    - oldEndVnode / newEndVnode (旧结束节点/新结束节点)
    - oldStartVnode / newEndVnode (旧开始节点/新结束节点)
    - oldEndVnode / newStartVnode (旧结束节点/新开始节点)
  - 开始节点和结束节点比较，这两种情况类似
    - oldStartVnode / newStartVnode (旧开始节点/新开始节点)
    - oldEndVnode / newEndVnode (旧结束节点/新结束节点)
  - 如果 oldStartVnode 和 newStartVnode 是 sameVnode (key 和 sel 相同)
    - 调用 patchVnode() 对比和更新节点
    - 把旧开始和新开始索引往后移动 oldStartIdx++ / oldEndIdex++
  - oldStartVnode /newEndVnode (旧开始节点/新结束节点) 相同
    - 调用 patchVnode() 对比和更新节点
    - 把 oldStartVnode 对应的 DOM 元素，移动到右边
    - 更新索引
  - oldEndVnode / newStartVnode (旧结束节点/新开始节点)相同
    - 调用 patchVnode() 对比和更新节点
    - 把 oldEndVnode 对应的 DOM 元素，移动到左边
    - 更新索引
  - 如果不是以上四种情况
    - 遍历新节点，使用 newStartVnode 的 key 在老节点数组中找相同节点
    - 如果没有找到，说明 newStartVnode 是新节点
      - 创建新节点对应的 DOM，插入到 DOM 树中
    - 如果找到了
      - 判断新节点和找到的老节点的 sel 选择器是否相同
      - 如果不相同，说明节点被修改了
        - 重新创建对应的 DOM 元素，插入到 DOM 树中
      - 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边
  - 循环结束
    - 当老节点的所有子节点先遍历完（oldStarIdx > oldEndIdx）,循环结束
    - 当新节点的所有子节点先遍历完（newStartIdx > newEndIdex）,循环结束
  - 如果老节点的数组先遍历完（oldStartIdx > oldEndIdx）, 说明新节点有剩余，把剩余节点批量插入到右边
  - 如果新节点的数组先遍历完（newStartIdx > newEndIdx）, 说明老节点有剩余，把剩余节点批量删除
- 源码位置 src/snabbdom.ts

#### Module 源码

- patch() -> patchVnode() -> updateChildren()
- Snabbdom 为了保证核心库的精简，把处理元素的属性/事件/样式等工作，放置到模块中
- 模块可以按照需要引入
- 模块的使用可以查看官方文档
- 模块实现的核心是基于 Hooks

##### Hooks

- 预定义的钩子函数的名称
- 源码位置：src/hooks.ts

## Vue.js 源码分析

