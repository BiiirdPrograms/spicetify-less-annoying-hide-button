(function pinHideButtonToTop() {
  if (!document.body || !document.head) {
    setTimeout(pinHideButtonToTop, 100);
    return;
  }

  const style = document.createElement("style");
  style.id = "spicetify-pin-hide-style";
  style.textContent = `
    #context-menu ul {
      display: flex;
      flex-direction: column;
    }

    #context-menu ul > li {
      margin-block: 0;
    }

    #context-menu li.spicetify-pin-top {
      order: -1;
    }
  `;
  document.head.appendChild(style);

  const tagHideItem = (menuRoot) => {
    for (const btn of menuRoot.querySelectorAll("button.main-contextMenu-menuItemButton")) {
      if (btn.textContent?.trim().toLowerCase() === "hide in this playlist") {
        btn.closest("li.main-contextMenu-menuItem")?.classList.add("spicetify-pin-top");
        break;
      }
    }
  };

  let activeMenu = null;

  const menuObserver = new MutationObserver(() => {
    if (activeMenu) tagHideItem(activeMenu);
  });

  // subtree b/c #context-menu is not popup root
  const bodyObserver = new MutationObserver(() => {
    const menu = document.getElementById("context-menu");

    if (menu && menu !== activeMenu) {
      activeMenu = menu;
      tagHideItem(menu);
      menuObserver.disconnect();
      menuObserver.observe(menu, { childList: true, subtree: true });
    } else if (!menu && activeMenu) {
      activeMenu = null;
      menuObserver.disconnect();
    }
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();

