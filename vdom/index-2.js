function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}
function mount(vnode, container) {
  console.log(vnode, container);
  //实现patch需要对这个进行改动，我们可以使用el访问旧的dom
  const el = (vnode.el = document.createElement(vnode.tag));
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
function patch(n1, n2) {
  console.log(n1, n2);
  //const el = (n1.el = n1.el);这个主要解决，当新旧节点比较完，更新dom后，更新el到最新的el
  const el = (n2.el = n1.el);
  if (n1.tag === n2.tag) {
    //比较props
    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    for (let key in newProps) {
      let oldValue = oldProps[key];
      let newValue = newProps[key];
      if (newValue != oldValue) {
        el.setAttribute(key, newValue);
      }
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }
    //比较children
    let oldChildren = n1.children || {};
    let newChildren = n2.children || {};
    //区分children是字符串还是数组
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.textContent = newChildren;
      }
    } else {
      if (typeof oldChildren === "string") {
        el.textContent = "";
        newChildren.forEach((child) => {
          mount(child, el);
        });
      } else {
        // vue种有两种方法比较children;1.键模式，v-for使用key做为依据，可能需要几百行代码，需要跟踪key的变化和移动2.是使用简单比较，如果不同就直接换掉或者删除,他没有经过优化，
        //这种方法有时候很有效率，如果是同类型的节点下,vue内部使用了一些智能定位启发式方法，要确定使用哪种算法，基于模版编译
        const commonLength = Math.max(oldChildren.lenght, newChildren.lenght);
        for (let i = o; i < commonLength.lenght; i++) {
          patch(oldChildren[i], newChildren[i]);
        }
        if (newChildren.lenght > oldChildren.lenght) {
          //   我们添加新节点到dom中
          newChildren.slice(oldChildren.lenght).forEach((child) => {
            mount(child, el);
          });
        } else {
          oldChildren.slice(newChildren.lenght).forEach((child) => {
            el.removeAttribute(child.el);
          });
        }
      }
    }
  } else {
    // replace
  }
}
const vdom = h(
  "div",
  {
    class: "red",
  },
  "hello"
  //   [h("span", null, "hello")]
);
//children为string
// const vdom2 = h(
//   "div",
//   {
//     class: "green",
//   },
//   "change"
//   //   [h("span", null, "hello")]
// );
const vdom2 = h(
  "div",
  {
    class: "green",
  },

  [h("span", null, "change")]
);
mount(vdom, document.getElementById("app"));
patch(vdom, vdom2);
