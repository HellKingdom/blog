### 前言
    随着当下互联网技术的发展，网站做的越来越大，网页所需要的加载时间也在变长。因此，网站性能优化是一每一个开发者都需要考虑的一个强需求。作为
能优化的一种十分有效手段--缓存，凸显的尤为重要。缓存使得部分非经常性变更的静态资源得以保存，用户在下次访问时不会再次去加载，以获得更快的加载速度和更优质的用户体验。


### 缓存的分类
  1、强缓存：即本地缓存，客户端不需要发起请求，直接使用客户端保存下的缓存数据。
  2、协商缓存：即304缓存，客户端会将本地的缓存标识发送到服务端，由服务端判定是否命中缓存。服务端根据相应的标识来判断成功与否，成功则返回状态码304，客户端使用本地缓存数据；失败则请求最新的数据返回给客户端，状态码为200。
  [cache](./cache.jpg)

### 浏览器的缓存图解
  在客户端第一次发起请求时，本地无缓存，向web服务器发送请求，服务器起端响应请求，浏览器端缓存。服务器会将文件资源最后修改时间通过Last-Modified标识由服务器发送给客户端，客户端记录修改时间；服务器还会生成一个Etag，并发送给客户端。
  当客户端再次发起请求时，首先判定强缓存是否过期，未过期则直接读取本地缓存；若过期则会将服务端发送的Last-Modified和Etag作为If-Modified-Since以及If-None-Match的值发到服务端，由服务端判定缓存，并返回相应的结果，如下图：
  [cache_result](./cache_result.jpg)

### 缓存机制
  1、http报文相关字段
    Cache-control：表明客户端是否从本地缓存拿数据以及缓存数据的生存期限，
    cache-control的值有：public、no-cache、no-store、max-age等，相应的含义为：
      public：表示响应可被任何缓存区缓存。
      max-age=xxx：缓存数据的有效期
      no-cache：需要使用对比缓存来验证缓存数据。
      no-store：所有内容都不会缓存，强制缓存，对比缓存都不会触发

    Last-Modified：表示文件资源在服务器上的最新更新时间。

    ETag：文件资源的特殊标识。服务器存储着文件资源的Etag字段，可以在与每次客户端传送If-no-match的字段进行比较，相同则协商缓存生效，不同则返回最新数据。与Last-Modified的功用相同，且优先级更高，精确程度更高。

    If-Modified-Since：客户端非首次请求时需要携带的字段，用户服务器与本身存储的对应Last-Modified字段作对比，相同则协商缓存生效，不同则返回最新数据。

    Expires：表示文件资源的失效时间。与Cache-control的功能重复，且优先级低于Cache-control。另外，Expires使用的是服务器生成的绝对时间，可能存在客户端时间与服务器时间有偏差，导致缓存命中失败。

    If-None-Match：客户端非首次请求时需要携带的字段，用户服务器与本身存储的对应Etag字段作对比，如果If-None-Match的值大于Last-Modified则协商缓存不生效生效并返回最新数据，反之，返回最新数据。

    我们可以通过Chrom的控制台来查看一个资源文件在不同情况下的报文情况：
    首次请求：状态值200
    [first_cache](./first_cache.png)
    协商缓存：状态值304
    [first_cache](./first_cache.png)

  2、缓存机制分析
    通过截图可以看见，首次请求时，request请求体没有携带If-Modified-Since、If-None-Match这些缓存字段，服务端返回了200。第二次请求时，request请求体携带了If-Modified-Since、If-None-Match、max-age=0这些缓存字段，服务端返回了304，请求时间也大大减少了。
    Cache-Control 和 Last-Modified 一般用在 Web 的静态资源文件上，通过设置资源文件缓存属性，对提高资源文件加载速度，节省流量很有意义，特别是移动网络环境。设置一个较长的过期时间，优化减少文件的请求。
    较长的过期时间会来更新上的问题，这需要我们在部署前端代码的时候做到精确到单个文件粒度的缓存控制，生成对应的文件摘要信息，并将此信息携带到单个文件的url上。同时，在版本发布时，需要摒弃文件资源的覆盖式发布，改用非覆盖式发布的模式。如此，就可以做到‘消灭304’的同时，解决版本更新的不及时问题。

### 用户行为与缓存的有效性
    [cache_effect](./cache_effect.jpg)

### 延伸
  1、存储机制 DOM Storage
    DOM Storage是类似与cookie的W3C Web 存储规范。它被设计用来提供一个更大存储量（5MB）、更安全、更便捷的存储方法，从而可以代替掉将一些不需要让服务器知道的信息存储到 cookies 里的这种传统方法。它的存储形式是一种key-value的字符串格式，存放在浏览器本地，不会别每一次的请求携带至服务端。
    DOM Storage分为Local Storage和Session Storage。两者的存储方法、存储形式都一样，不同的是Local Storage是没有过期时间的，只要不清除，会一直存放在本地，不会失效。而Session Storage只存储在页面会话中，当页面关闭时，相应的存储信息也会被释放掉。
    DOM Storage 亦是有其自身的局限性。DOM Storage的值类型限定为string类型，这个在对我们日常比较常见的JSON对象类型需要一些转换；在浏览器的隐身模式下是不可读取的；DOM Storage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡；DOM Storage在部分浏览器上不被支持。
    DOM Storage 提供了以下几种方法：
    ```
    interface Storage { 
      readonly attribute unsigned long length; 
      [IndexGetter] DOMString key(in unsigned long index); 
      [NameGetter] DOMString getItem(in DOMString key); 
      [NameSetter] void setItem(in DOMString key, in DOMString data); 
      [NameDeleter] void removeItem(in DOMString key); 
      void clear();
    };
    ```
  2、Indexed Database
