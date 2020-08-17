class Watcher {
  // vm vue实例 key data中的属性名 cb 回调函数
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key // data 中的属性名称
    this.cb = cb // 回调函数，负责更新视图

    // 把 watcher 对象记录到 Dep 类的静态属性 target
    Dep.target = this
    // 触发 get 方法，在 get 方法中会调用 addSub
    this.oldValue = vm[key]
    Dep.target = null
  }

  // 当数据发生变化的时候更新视图
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) return
    this.cb(newValue)
  }
}