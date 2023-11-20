const ClickOutsideDirective = {
  mounted(el, binding) {
    el.__ClickOutsideHandler__ = (event) => {
      console.log("clicking outside");
      console.log("%c event :", "color: yellow", event);
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener("click", el.__ClickOutsideHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.__ClickOutsideHandler__);
  },
};

export default (app) => {
  app.directive("click-outside", ClickOutsideDirective);
};
