### 路由的基本概念
    路由用于设定访问路径，并将路径和组件映射起来。
### 路由导航的解析流程
    1、导航被触发
    2、在失活的组件里调用离开守卫
    3、调用全局的 beforeEach 守卫
    4、在重用的组件里调用 beforeRouteUpdate 守卫
    5、在路由配置里调用 beforEnter
    6、解析异步路由组件
    7、在被激活的组件里调用 beforeRouteEnter
    8、调用全局的 beforeResolve 守卫
    9、导航被确认
    10、调用全局的 afterEach 钩子
    11、触发 DOM 更新
    12、在创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数
### 路由的钩子函数
    vue路由的钩子函数分为三类：全局钩子函数、组件路由、单个路由的钩子函数
    全局钩子函数包括beforeEach和afterEach
     beforeEach函数有三个参数：
        to:router即将进入的路由对象
        from:当前导航即将离开的路由
        next:Function,进行管道中的一个钩子，如果执行完了，则导航的状态就是 confirmed （确认的）；否则为false，终止导航。
        
    afterEach函数不用传next()函数
    全局钩子函数主要用于登录拦截、用户权限管理、页面加载的动画开启和结束

    组件路由包括beforeRouterEnter（此时组件实例this对象无法取到）、beforeRouterUpdate和beforeRouterLeave；其参数与全局钩子函数等同。这三个函数式写在组件内部的，与data函数处于同一级别

    单个路由的钩子函数包括beforeEnter、beforeLeave；主要用于写某个指定路由跳转时需要执行的逻辑，一般很少用到
### 路由中的几个基本概念route、routes、router
    route:即单个每一条的路由
    routes: 即单个的路由所形成的的数组
    router: 管理路由的一个机制，类似于一个管理者。将组件与路径相互匹配，渲染路径所指向的页面内容
### 滚动行为
    当新页面有滚动位置确认,可以使用scrollBehavior（history模式下可以应用）
    ```
    const router = new VueRouter({
        routes: [...],
        //所有路由新页面滚动到顶部：
        scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
        }

        //如果有锚点
        scrollBehavior (to, from, savedPosition) {
            if (to.hash) {
                return {
                selector: to.hash
                }
            }
        }
    })
    ```
### 路由的跳转
    路由跳转可以调用<router-link>来创建可跳转链接或者this.$router.push()方法来实现
    ```
    <router-link to="/linkParams/xuxiao">点我不会怀孕</router-link>

    // 字符串,这里的字符串是路径path匹配噢，不是router配置里的name
    this.$router.push('home')

    // 对象
    this.$router.push({ path: 'home' })

    // 命名的路由 这里会变成 /user/123
    this.$router.push({ name: 'user', params: { userId: 123 }})

    // 带查询参数，变成 /register?plan=private
    this.$router.push({ path: 'register', query: { plan: 'private' }})
    ```
