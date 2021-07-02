
let Vue;

// 声明插件
class VueRouter{
  constructor(options){
    // 1.保存路由选项
    this.$options = options

    // current初始值
    // this.current = window.location.hash.slice(1)||'/'

    // 如何使current成为响应式数据
    Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/')
    
    // 2.监听hash变化
    window.addEventListener('hashchange',()=> {
      this.current = window.location.hash.slice(1)
    })
    
  }

}

/**
 * 
 * @param {*} _Vue 传入vue构造函数，对其进行扩展
 */
VueRouter.install = function(_Vue){
  Vue = _Vue

  // 1.注册$Router,让所有组件实例都可访问
  // 延迟执行，直到router实例和vue实例都创建完毕
  Vue.mixin({
    beforeCreate() {
      if(this.$options.router){
        // 如果存在，说明是根组件
        Vue.prototype.$router = this.$options.router
      }
    },
  })
  
  // 2.注册全局组件：router-link,router-view
  Vue.component('router-link',{
    props:{
      to:{
        type:String,
        required:true
      }
    },
    // h是render函数调用时，框架传入的createElement，返回vdom
    render(h){
      return h('a',{
        attrs:{
          href:'#'+this.to
        }
      }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render(h) {
      let component = null
      // 1.获取当前url的hash部分
      // this.$router.current
      // 2.根据hash从路由表获取对应组件
      const route = this.$router.$options.routes.find(route => route.path === this.$router.current)
      if(route){
        component = route.component
      }
      return h(component)
    }
  })
}

export default VueRouter

