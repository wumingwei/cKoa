// let obj = {
//   _name: 'test',

//   get: function name() {
//     return this._name;
//   },

//   set: function name(val) {
//     console.log('set', val);
//     this._name = val;
//   },
// };
// console.log(obj._name);
// obj._name = 'hello world';
// console.log(obj._name);

// function add(x, y) {
//   return x + y;
// }

// function double(z) {
//   return z * 2;
// }

// const res1 = add(1, 2);
// const res2 = double(res1);
// const res3 = double(add(1, 2));

// console.log(res2);
// console.log(res3);

// // 同步的compose
// const middlewares = [add, double];

// let len = middlewares.length;

// function compose(midds) {
//   return (...args) => {
//     // 初始值
//     let res = midds[0](...args);
//     for (let i = 1; i < len; i++) {
//       res = midds[i](res);
//     }
//     return res;
//   };
// }

// const fn = compose(middlewares);
// const res = fn(1, 2);
// console.log(res);

// 异步的compose,支持async/await对外暴露next,支持promise

async function fn1(next) {
  console.log('fn1');

  await next();

  console.log('fn1 end');
}

async function fn2(next) {
  console.log('fn2');
  await delay();
  await next();

  console.log('fn2 end');
}

async function fn3(next) {
  console.log('fn3');
}

function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

// 异步的compose

const middlewares = [fn1, fn2, fn3];
function compose(middlewares) {
  return function () {
    return dispatch(0);

    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(function next() {
          return dispatch(i + 1);
        })
      );
    }
  };
}

const finalFn = compose(middlewares);
finalFn();
