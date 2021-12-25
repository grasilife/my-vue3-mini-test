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

const targetMap = new WeakMap();

function trick(target, key) {
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
  dep.add(effect);
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

//----------------------漂亮的分割线------------------------
//定义响应式数据
let product = reactive({
  price: 5,
  quanity: 2,
});
let tatal = 0;
//使用Set是因为不能重复，添加两个effetc将只有一个生效
const effect = () => {
  tatal = product.price * product.quanity;
};
effect();
console.log(targetMap, "targetMap");
// //自动执行依赖收集
product.quanity = 6;
product.price = 6;
//自动触发effect
console.log(tatal, "执行依赖后tatal"); //tatal=15
