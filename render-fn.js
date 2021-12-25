import { h } from "vue";
const App = {
  render() {
    return h(
      "div",
      {
        id: "hello",
      },
      ["hello", h("span", "world")]
    );
  },
};
// 得到这样的dom <div id='hello'>hello <span>world</span> </div>
//使用v-if,直接使用js实现
const App = {
  render() {
    return this.ok
      ? h(
          "div",
          {
            id: "hello",
          },
          ["hello", h("span", "world")]
        )
      : h("h1", "hello world");
  },
};

//使用v-for
const App = {
  render() {
    return this.list.map((item, index) => {
      return h(
        "div",
        {
          key: index,
        },
        item.text
      );
    });
  },
};
//slot
const App = {
  render() {
    let slot = this.$slots.default ? this.$slots.default() : [];
    //可以给default传递参数
    return h("div", slot);
  },
};
