function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}
function mount(vnode, container) {
  console.log(vnode, container);
  const el = document.createElement(vnode.tag);
  //props
  if (vnode.props) {
    for (let key in vnode.props) {
      const value = vnode.props[key];
      el.setAttribute(key, value);
    }
  }
  console.log(el);
  //children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      //innerText是IE的私有实现,但也被除FF之外的浏览器所实现,textContent 则是w3c的标准API,现在IE9也实现了。
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((child) => {
        mount(child, el);
      });
    }
  }
  container.appendChild(el);
}
const vdom = h(
  "div",
  {
    class: "red",
  },
  "hello"
  //   [h("span", null, "hello")]
);
const vdom2 = h(
  "div",
  {
    class: "green",
  },
  "change"
  //   [h("span", null, "hello")]
);

mount(vdom, document.getElementById("app"));
