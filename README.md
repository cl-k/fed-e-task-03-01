# 手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法
## 简答题

### 1.当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么？

```js
let vm = new Vue({
	el: '#el',
	data: {
		o: 'object',
		dog: {}
	},
	methods: {
		clickHandler () {
			// 该 name 属性是否是响应式的
			this.dog.name = 'Trump'
		}
	}
})
```

答：

- 如上代码所示增加的成员不是响应式数据。

  Vue 中 data 中的成员之所以是响应式的，是因为在new Vue 时，构造函数接收了 data，然后遍历 data 中的成员，使用 Object.defineProperty 给data 中的每个数据都转成 getter/setter 后定义在 Vue 实例上。然后通过 observer 对数据进行劫持

- 如果需要把新增成员设置成响应式数据，可以在新增成员时使用 [Vue.set( target, propertyName/index, value )](https://cn.vuejs.org/v2/api/#Vue-set)

### 2.请简述 Diff 算法的执行过程

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