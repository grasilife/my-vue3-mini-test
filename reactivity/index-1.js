let price = 5;
let quanity = 2;
let tatal = 0;
let dep = new Set();
//使用Set是因为不能重复，添加两个effetc将只有一个生效
const effect = () => {
  return (tatal = price * quanity);
};
function trick() {
  //track跟踪的意思，跟踪依赖
  dep.add(effect);
}
function trigger() {
  // trigger是触发的意思,触发依赖
  dep.forEach((effect) => {
    effect();
  });
}
trick();
console.log(dep, "dep");
//验证阶段
effect();
console.log(tatal, "tatal"); //tatal=10
//修改数据
price = 6;
quanity = 6;
//执行依赖项
trigger();
//触发依赖
console.log(tatal, "执行依赖后tatal"); //tatal=15
