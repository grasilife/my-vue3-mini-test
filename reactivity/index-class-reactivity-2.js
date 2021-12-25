let activeEffect;
class Dep {
  constructor(value) {
    this.subscribers = new Set();
    this.value = value;
  }

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
const dep = new Dep("hello");
watchEffect(() => {
  dep.depend();
  console.log(dep.value);
});
dep.value = "change";
dep.notify(); //effetc run
