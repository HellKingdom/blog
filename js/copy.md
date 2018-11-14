### JS拷贝
 JS的拷贝分为深拷贝以及浅拷贝。浅拷贝简单的说A复制B,修改A则会连带修改B,深拷贝则完全独立，不在相互影响。

 深浅拷贝只对引用数据对象（Obejct、Array、Function）有区别，对于基本类型数据（String、Number、Boolean、null、undefined）则拷贝之后相互独立，它们都相互独立存在，而引用数据对象的浅拷贝只会复制引用地址，对于相关的堆内存数据值不会拷贝

 ### JS拷贝的缘由
    对于基本数据类型而言，它的名字以及值都是存放在栈内存中的，故而拷贝后会新开辟一个栈内存，它们之间就会相互独立，不在相互依存，如下图所示：

    如var a=1;
    [base1](./base1.jpg)

    var b = a ,则会新开辟一个内存空间，
    [base2](./base2.jpg)

    对于引用数据类型来说，它的名字会存储在栈内存中，但它的值会存储在堆内存中，栈内存与名字相对应的值会存放一个堆内存引用地址

    如 var a = [0, 1, 2, 3, 4]
    [base3](./base3.jpg)

    var b = a, 则会在栈内存中复制一个a的名以及堆内存引用地址，而堆内存的值并不会复制， 如下图
    [base4](./base4.jpg)

    所以修改a的时候，b的值也会发生相应的改变，因为它们引用的是同一个堆内存的值
    [base5](./base5.jpg)
 ### 实现深拷贝的几种方法
1、利用递归思想，原生封装一个深拷贝的方法

```
function deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}    
let a=[1,2,3,4],
    b=deepClone(a);
a[0]=2;
console.log(a,b);

```

2、利用JSON对象的JSON.Stringify和JOSN.parse来实现深拷贝
```
function deepClone(obj){
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone
}    
let a=[0,1,[2,3],4],
    b=deepClone(a);
a[0]=1;
a[2][0]=1;
console.log(a,b);
```