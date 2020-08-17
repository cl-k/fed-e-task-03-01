let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 1.判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true // 记录插件已安装

    // 2.把 Vue 构造函数记录到全局变量
    _Vue = Vue

    // 3.把创建 Vue 实例时候传入的 router 对象注入到 Vue 实例上
    // 使用混入给所有 vue 实例混入一个选项
    _Vue.mixin({
      beforeCreate () {
        // 判断当前实例的 $options 选项中是否有 router 这个属性
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  // 构造函数
  constructor (options) {
    this.options = options // 记录构造函数中传入的 options
    this.routeMap = {} // 作用：把传入的 options 中的 routes (路由规则) 解析出来，路由地址是键，对应组件是值
    this.data = _Vue.observable({
      current: '/' // 存储当前的路由地址
    }) // data 应该是一个响应式的对象
    this.init()
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue, this.options)
    this.initEvent()
  }

  // createRouteMap 方法的作用是把构造函数中传入的选项中的routes(路由规则)，转换成键值对的形式存储到 routeMap 对象中
  createRouteMap () {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到 routeMap 中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  // 接收一个 Vue 的构造函数为参数
  initComponents (Vue, options) {
    // 创建 router-link 组件
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default]) // this.$slots.default 来获取默认插槽的内容
      },
      methods: {
        clickHandler (e) {
          console.log(options)
          if (options.mode === 'history') {
            history.pushState({}, '', this.to) // history 模式的处理
          } else {
            location.hash = this.to // hash 模式的处理
          }
          this.$router.data.current = this.to
          e.preventDefault() // 阻止默认行为
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })

    const self = this
    // 创建 router-view 组件
    Vue.component('router-view', {
      render (h) {
        const component = self.routeMap[self.data.current] // 当前路由地址对应的组件
        return h(component)
      }
    })
  }

  // 用来注册 popstate, hashchange 事件
  initEvent () {
    window.addEventListener('popstate', () => {
      // 把当前地址栏中的地址路径取出
      this.data.current = window.location.pathname
    })

    window.addEventListener('hashchange', () => {
      this.data.current = window.location.hash.slice(1)
    })
  }
}
