let activeEffect;
class Dep {
  subscribers = new Set();
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}
const targetMap = new WeakMap();
//WeakMap的好处是如果这个目标对象，他本身不在可以从任何代码访问，这个目标可以被垃圾回收，如果key是字符串的话，你就不能垃圾回收，WeakMap不能被迭代
function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}
const reactiveHandlers = {
  get(target, key, receiver) {
    const dep = getDep(target, key);
    dep.depend();
    // return target[key];
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const dep = getDep(target, key);
    const result = Reflect.set(target, key, value, receiver);
    dep.notify();
    return result;
  },
};
function reactive(raw) {
  return new Proxy(raw, reactiveHandlers);
}
const state = reactive({
  count: 0,
});
watchEffect(() => {
  console.log(state.count);
});
state.count++;
