### JS的事件机制运行
    js是一个单线程的脚本语言，在此线程中只有一个事件循环。
    js代码的运行过程中是基于函数调用栈来确认主体函数（即script的完整代码）的执行顺序，同时依靠任务队列来确认一些非主体函数（如settimeout、promise等）的执行顺序
    在一个线程中，事件循环是惟一的，但任务队列可以有多个
    任务队列分为宏任务（macro-task）以及微任务（micro-task）
    macro-task包含：setTImeout、setInterval、setImmediate、I/O、UI rendering等
    micro-task包含：promise、process.nextTick等
    promise、setTimeout等为任务源，进入任务队列的是它们具体需要执行的任务
    来自不同任务源的任务会进入不同的任务队列，其中setTimeout与setInterval是同源的
    每一个任务的执行，无论是微任务（micro-task）还是宏任务（macro-task）都是基于函数调用栈来执行完成的
    事件循环的顺序决定了js代码的执行顺序。js代码从主体函数运行开始第一次循环，之后全局上下文进入函数调用栈，直到函数调用栈被运行清空。接下来执行所有的micro-task,当所有可执行的微任务（micro-task）执行结束后，开始执行宏任务（macro-task）,找到其中一个任务队列执行完毕，然后再执行所有的微任务（micro-task），往复循环执行
    宏任务队列的执行顺序：script(整体代码)->setTimeout(setInterval同源)->setImmediate  微任务队列的执行顺序：process.nextTick->Promise(then)

### 案例分析
    具体的我们可以根据下面的一个代码案例去做具体分析
    ```
    console.log('golb1')
    setTimeout(function() {
        console.log('timeout1')
        process.nextTick(function() {
            console.log('timeout1_nextTick')
        })
        new Promise(function(resolve) {
            console.log('timeout1_promise')
            resolve()
        }).then(function() {
            console.log('timeout1_then')
        })
    })

    setImmediate(function() {
        console.log('immediate1');
        process.nextTick(function() {
            console.log('immediate1_nextTick')
        })
        new Promise(function(resolve) {
            console.log('immediate1_promise')
            resolve()
        }).then(function() {
            console.log('immediate1_then')
        })
    })

    process.nextTick(function() {
        console.log('glob1_nextTick')
    })
    new Promise(function(resolve) {
        console.log('glob1_promise')
        resolve()
    }).then(function() {
        console.log('glob1_then')
    })

    setTimeout(function() {
        console.log('timeout2');
        process.nextTick(function() {
            console.log('timeout2_nextTick')
        })
        new Promise(function(resolve) {
            console.log('timeout2_promise')
            resolve()
        }).then(function() {
            console.log('timeout2_then')
        })
    })

    process.nextTick(function() {
        console.log('glob2_nextTick')
    })
    new Promise(function(resolve) {
        console.log('glob2_promise')
        resolve()
    }).then(function() {
        console.log('glob2_then')
    })

    setImmediate(function() {
        console.log('immediate2')
        process.nextTick(function() {
            console.log('immediate2_nextTick')
        })
        new Promise(function(resolve) {
            console.log('immediate2_promise')
            resolve()
        }).then(function() {
            console.log('immediate2_then')
        })
    })
    ```

    步骤分析
    1、主体代码（script）执行，输出 glob1
    2、代码执行遇到setTimeout，setTimeout将待执行的任务分发到宏任务（macro-task）队列，等待执行
    3、代码执行遇到setImmediate，setImmediate将待执行任务分发到对应的宏任务（macro-task）队列，setImmediate的任务队列会在setTimeout队列的后面执行
    4、代码执行遇到process.nextTick，process.nextTick将待执行任务分发到微任务（micro-task）队列，等待执行
    5、代码执行遇到promise，promise的.tnen方法分发到微任务（micro-task）队列，同时执行promise本身的构造方法，输出 glob1_promise
    6、代码执行遇到第二个setTimeout，将待执行的任务插入到上一个setTimeout的宏任务（macro-task）队列后面，等待执行
    7、代码执行遇到第二个process.nextTick，将待执行的任务插入到上一个process.nextTick的微任务（micro-task）队列后面，等待执行
    8、代码执行遇到第二个promise，将待执行的任务promise的.then方法插入到上一个promise的微任务（micro-task）队列后面，同时执行promise本身的构造方法，输出 glob2_promise
    9、代码执行遇到第二个setImmediate，将待执行任务插入到上一个setImmediate宏任务（macro-task）队列，等待执行
    10、主体代码执行结束，开始执行第一轮微任务（micro-task），首先输出process.nextTick的 glob1_nextTick 、glob2_nextTick；再执行输出promise的glob1_then、glob2_then，微任务（micro-task）列表执行结束；
    11、开始执行宏任务（macro-task），先输出第一个setTimeout的timeout1以及内部promise的构造函数输出的timeout1_promise，同时生成相应的微任务（micro-task），再输出第二个setTimeot的timeout2以及内部promise的构造函数输出的timeout1_promise，同时生成相应的微任务（micro-task），第一轮宏任务（macro-task）执行结束。
    12、开始执行第二轮微任务（micro-task），即setTimeout内部产生的微任务。输出setTimeout内部生成的process.nextTick任务，输出timeout1_nextTick、timeout2_nextTick；再输出setTimeout内部产生的promise任务，输出timeout1_then、timeout2_then。第二轮微任务（micro-task）结束。
    13、开始往复执，先后输出immediate1、immediate1_promise、immediate2、immediate2_promise、immediate1_nextTick、immediate2_nextTick、immediate1_then、immediate2_then

### 相关学习来源
    https://www.cnblogs.com/pzy-123/articles/7245473.html