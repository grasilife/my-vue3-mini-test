let product = {
  price: 5,
  quanity: 2,
};
let tatal = 0;
const targetMap = new WeakMap();
//使用Set是因为不能重复，添加两个effetc将只有一个生效
const effect = () => {
  return (tatal = product.price * product.quanity);
};
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
//收集quanity依赖
trick(product, "quanity");
trick(product, "price");
console.log(targetMap, "targetMap");
//验证阶段
effect();
console.log(tatal, "tatal"); //tatal=10
//修改数据
product.quanity = 6;
product.price = 6;
trigger(product, "quanity");
trigger(product, "price");
//触发依赖
console.log(tatal, targetMap, "执行依赖后tatal"); //tatal=15
