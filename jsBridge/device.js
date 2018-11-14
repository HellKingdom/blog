var device = {};
var ua = navigator.userAgent;

var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

// Android
if (android) {
    device.os = 'android';
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
}
if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
}
// iOS
if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.');
    device.iphone = true;
}
if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.');
    device.ipad = true;
}
if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    device.iphone = true;
}
// iOS 8+ changed UA
if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
        device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
}


// 当前浏览器是不是微信
device.isWeixin = device.isOpera = device.isChrome = device.isFirefox = device.isAli = device.isSafari = device.isIE = false

if (isOpera) {
    //判断是否Opera浏览器
    device.isOpera = true
} else if (/firefox/.test(ua)) {
    //判断是否Firefox浏览器
    device.isFirefox = true
} else if (/chrome/.test(ua)) {
    //判断是否chrome浏览器
    device.isChrome = true
} else if (/safari/.test(ua)) {
   //判断是否Safari浏览器
   device.isSafari = true
} else if (/compatible/.test(ua) && /msie/.test(ua) && !device.isOpera) {
    //判断是否IE浏览器
    device.isIE = true
} else if (/micromessenger/.test(ua)) {
    //判断是否为支付宝浏览器
    device.isWeixin = true
} else if (/alipayclient/.test(ua)) {
    //判断是否为支付宝浏览器
    device.isAli = true
} else {
    // 未知类型，作谷歌处理
    device.isChrome = true
}

// 当前设备是不是手机端
device.isMObile = MOBILE_UA_REGEXP = /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone|Prerender|MicroMessenger)/i.test(ua);

export default device;