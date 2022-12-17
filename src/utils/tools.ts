//防抖
export function debounce(fn: Function, delay: number, immediate = false) {
  let timer: any = null;
  //定义内部变量来控制是否第一个立即执行
  let isInvoke = false;

  const _debounce = function (this: any, ...args: any[]) {
    //返回一个Promise用来处理函数的返回值

    return new Promise((resolve) => {
      if (timer) clearTimeout(timer);
      //判断是否立即执行
      if (immediate && !isInvoke) {
        let result = fn.apply(this, args);
        //promise返回 函数的返回值
        resolve(result);
        isInvoke = true;
      } else {
        timer = setTimeout(() => {
          let result = fn.apply(this, args);
          //promise返回 函数的返回值
          resolve(result);
          isInvoke = false;
          timer = null;
        }, delay);
      }
    });
  };
  //取消请求的发送
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
    console.log("取消成功！");
  };
  return _debounce;
}

//节流
export function throttle(
  fn: Function,
  interval: number,
  options = {
    leading: true,
    trailing: false,
  }
) {
  let timer: any = null;
  //leading第一次是否触发，trailing最后一次是否触发
  const {leading, trailing} = options;
  let lastTime = 0;
  const _throttel = function (this: any, ...args: any[]) {
    //在一段时间内最后一次触发的时间
    let nowTime = new Date().getTime();
    //如果leading=true 并且 lastTime = 0时，使第一次不触发
    if (!leading && !lastTime) lastTime = nowTime;
    //需要等待多少时间执行
    let remainTime = interval - (nowTime - lastTime);

    if (remainTime <= 0) {
      clearTimeout(timer);
      const result = fn.apply(this, args);
      lastTime = nowTime;
    } else {
      if (trailing) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const result = fn.apply(this, args);
          lastTime = new Date().getTime();

          timer = null;
        }, remainTime);
      }
    }
  };

  _throttel.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };
  return _throttel;
}

//邮箱脱敏
export function desensitize(email: string) {
  return email.replace(/\w+([-|\.]\w+)*@[\w]+\.[a-z]+/g, (email) => {
    return email.replace(/(\w{3}).*(\w{2})@(.*)/, "$1***$2@$3");
  });
}
