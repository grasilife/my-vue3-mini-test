const targetMap = new WeakMap();
let activeEffect = null;

function reactive(target) {
  const handle = {
    //Reflect保证了当我们的对象有继承自其他对象的值和函数时，this指针能正确的指向使用的对象，这将避免一些我们在vue有的响应式警告
    get(target, key, value) {
      let result = Reflect.get(target, key, value);
      trick(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (oldValue != result) {
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handle);
}

function trick(target, key) {
  if (activeEffect) {
    //创建targetMap依赖
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    //创建depsMap依赖
    let dep = depsMap.get(key);
    //如果没有依赖，这添加依赖，price，quanity，这些是依赖项
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    dep.add(activeEffect);
  }
}
function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  //如果存在依赖，则执行
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}
function effect(eff) {
  //activeEffect,用于解决使用比如console.log(product.quanity);时也会去执行依赖收集，我们需要修改我们的代码，让依赖收集只在effect调用时，才进行依赖收集
  activeEffect = eff;
  activeEffect();
  activeEffect = null;
}
function ref(raw) {
  //假设的ref封装方法，但是vue没这么做
  //   return reactive({
  //     value: intialValue,
  //   });
  const r = {
    get value() {
      trick(r, "value");
      return raw;
    },
    set value(newVal) {
      raw = newVal;
      trigger(r, "value");
    },
  };
  return r;
}
//----------------------漂亮的分割线------------------------

// 对象访问器,ref使用下面的特性封装
let user = {
  firstName: "fu",
  lastName: "guoqiang",
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(newVal) {
    [this.firstName, this.lastName] = newVal.split(" ");
  },
};
console.log(user.fullName);
user.fullName = "zhang yong";
console.log(user.fullName);
//

//----------------------漂亮的分割线------------------------
//定义响应式数据
let product = reactive({
  price: 5,
  quanity: 2,
});
let salePrice = ref(0);
let tatal = 0;
effect(() => {
  salePrice.value = product.price * 0.9;
});
effect(() => {
  console.log(salePrice, product, "hhhhhh");
  tatal = salePrice.value * product.quanity;
});
console.log(targetMap, "targetMap");
console.log(salePrice.value, tatal, "salePrice"); //tatal=10
// //自动执行依赖收集
product.quanity = 6;
product.price = 6;
//自动触发effect
console.log(salePrice.value, tatal, "执行依赖后tatal"); //tatal=15
