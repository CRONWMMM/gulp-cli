import 'babel-polyfill';
import $ from 'jquery';
import BScroll from 'better-scroll';
console.log(BScroll);
/**
 * 倒计时器
 *
 * 2018.3.19 创建
 *
 * 需求：
 * 1.可以创建多个互不干扰的独立倒计时器
 * 2.可以添加新的倒计时器
 * 3.可以删除某个倒计时器
 * 4.可以接收一个开始的时间戳
 * 5.任何独立的倒计时器每改变一次，就执行一次对应的回调函数
 * 6.单个倒计时结束/开始的时候派发事件，或者执行某个callback，并且能传递个性化参数
 *
 * 缺陷:
 * 1.这个写法等于创建了多个setTimeout，考虑到JS单线程的特性，倒计时器群会有略微的延迟，并不能保证绝对的准确
 * 2.如果这个时候一旦有阻塞操作，比如alert，倒计时也会一直被阻塞，直到进程空闲，所以我加上了reload方法，用来手动校准时间
 *
 */
const CountDown = (function() {
    // 首先执行依赖检测，检测不到依赖函数就报错
    if (!_isFunc(timeStamp)) {
        throw new Error('Loss of dependence funntion: timeStamp');
        return ;
    }

    /*
     props: {
     el: 【DOM-element】,						// DOM元素
     initVal: 【Int】,							// 倒计时器初始值，截止日期时间戳，毫秒
     start: 【Func】,							// 开始的回调函数
     finish: 【Func】,							// 结束的回调函数
     change: 【Func @params: oldTime, newTime】	// 状态改变的回调函数
     }
     */
    function _CountDown(props) {
        var self = this,													// ...
            el = props.el || null,											// ...
            initVal = !isNaN(props.initVal) ? props.initVal : 0,			// props里传入的初始值，毫秒
            start = _isFunc(props.start) ? props.start : function() {},		// 倒计时器开始时的回调函数
            finish = _isFunc(props.finish) ? props.finish : function() {},	// 倒计时器结束时的回调函数
            change = _isFunc(props.change) ? props.change : function() {};	// 倒计时改变时的回调函数

        this.state = {
            __flag__: false,		// 倒计时执行控制 flag
            __timer__: null,		// timeout 存储句柄
            _time: initVal			// 截止日期时间戳的初始值
        };
        this.props = props;			// props
        this.methods = {			// methods
            start: start,
            finish: finish,
            change: change
        };

        Object.defineProperties(this.state, {
            time: {
                get: function() {
                    return this._time;
                },
                set: function(val) {
                    this._time = val;
                    el.innerText = timeStamp(val / 1000);
                }
            }
        });
    }

    // 倒计时器生命周期
    _CountDown.prototype = {
        begin: function() {					// 开始
            this.state.__flag__ = true;
            this.methods.start();
            this.run();
        },
        run: function() {					// 执行中
            var self = this;
            if (!this.state.__flag__) return ;
            this.state.__timer__ = setTimeout(function() {
                var oldTime = self.state.time,
                    newTime = oldTime - 1000;
                self.state.time = newTime;
                if (self.state.time > 0) {
                    self.methods.change(oldTime, newTime);
                    self.run();
                } else {
                    self.finish();
                    return ;
                }
            }, 1000);
        },
        pause: function() {},				// 暂停
        continue: function() {},			// 继续
        reload: function(val) {				// 倒计时重载，必要的时候用来校准时间
            var props = this.props,
                state = this.state;
            state.__flag__ = true;
            state._time = val;
            props.el.innerText = timeStamp(val / 1000);
            this.run();
        },
        finish: function() {				// 结束
            this.state.__flag__ = false;
            if (this.state.__timer__ != null) clearTimeout(this.state.__timer__);
            this.state.time = 0;
            this.methods.finish();
        },
        destroy: function() {				// 销毁
            this.finish();
            this.state = null;
            this.props = null;
        }
    };

    // 函数判断
    function _isFunc(obj) {
        return typeof obj === 'function';
    }

    return _CountDown;

})();
/**
 * 秒转换成天/时/分/秒
 * @param   second_time  {Number} 返回秒数
 * @param   acc  		 {String} 保留精度(和timeStamp内部对应的单位)
 * @returns 		     {String}
 */
function timeStamp(second_time, acc){
    var config = {
            sec: '秒',
            min: '分',
            hour: '小时',
            day: '天'
        },
        divisor = {		// 除数，用作取余操作
            sec: 1,
            min: 60,
            hour: 3600,
            day: 43200
        },
        secondNum = parseInt(second_time),		// 总秒数
        timeStr = secondNum + config.sec,		// 最后返回的时间字符串
        limit = -1,
        sec,min,hour,day;						// 定义的变量
    sec = secondNum % divisor.min;
    if (secondNum >= divisor.min && secondNum < divisor.hour) {			// [1分钟, 1小时)
        min = parseInt(secondNum / divisor.min);
        timeStr = min + config.min + sec + config.sec;
    } else if (secondNum >= divisor.hour && secondNum < divisor.day) {		// [1小时, 1天)
        hour = parseInt(secondNum / divisor.hour);
        min = parseInt((secondNum - hour * divisor.hour) / divisor.min);
        timeStr = hour + config.hour + min + config.min + sec + config.sec;
    } else if (secondNum >= divisor.day) {									// [1天, Infinite天)
        day = parseInt(secondNum / divisor.day);
        hour = parseInt((secondNum - day * divisor.day) / divisor.hour);
        min = parseInt((secondNum - day * divisor.day - hour * divisor.hour) / divisor.min);
        timeStr = day + config.day + hour + config.hour + min + config.min + sec + config.sec;
    }

    limit = timeStr.indexOf(acc);
    if (limit >= 0) timeStr = timeStr.substring(0, limit + acc.length);

    return timeStr;
}
var countDowner = new CountDown({
    el: document.getElementById('div'),
    initVal: 6124120000,
    change(oldTime, newTime) {
        console.log(newTime);
    }
});
countDowner.begin();

function *kkk() {
    yield '1';
    yield '2';
}
var gen = kkk();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
alert("who's your daddy");
