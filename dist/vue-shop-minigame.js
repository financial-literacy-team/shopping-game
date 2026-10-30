import { defineComponent as F, ref as D, computed as h, watch as G, onUnmounted as J, openBlock as o, createBlock as K, Teleport as P, createVNode as Q, Transition as R, withCtx as W, createElementBlock as n, withModifiers as X, createElementVNode as t, normalizeClass as k, toDisplayString as c, createCommentVNode as g, Fragment as $, renderList as M } from "vue";
const Y = { class: "shop-minigame-card" }, Z = { class: "shop-minigame-header" }, ee = { class: "shop-timer-row" }, se = {
  key: 0,
  class: "shop-closed-note"
}, te = { class: "shop-minigame-body" }, ae = { class: "shop-item-grid" }, oe = ["draggable", "onDragstart"], ie = { class: "shop-item-icon" }, ne = ["src", "alt"], le = {
  key: 1,
  class: "shop-item-icon-text"
}, re = { class: "shop-item-info" }, ce = { class: "shop-item-name" }, de = {
  key: 0,
  class: "shop-item-desc"
}, ue = { class: "shop-item-meta" }, pe = { class: "shop-item-price" }, me = {
  key: 0,
  class: "shop-empty"
}, ve = {
  key: 1,
  class: "shop-drop-hint"
}, he = {
  key: 2,
  class: "shop-cart-list"
}, ge = { class: "shop-cart-name" }, fe = { class: "shop-cart-controls" }, _e = ["disabled", "onClick"], be = { class: "shop-qty-value" }, ke = ["disabled", "onClick"], ye = ["disabled", "onClick"], Ce = { class: "shop-cart-subtotal" }, De = { class: "shop-cart-summary" }, Te = { class: "shop-summary-row" }, Ie = { class: "shop-summary-row" }, xe = {
  key: 0,
  class: "shop-warning"
}, we = {
  key: 1,
  class: "shop-warning"
}, qe = ["disabled"], $e = /* @__PURE__ */ F({
  __name: "Shop",
  props: {
    isOpen: { type: Boolean, default: !1 },
    catalog: { default: () => [] },
    balance: { default: 0 },
    errorMessage: { default: null }
  },
  emits: ["checkout", "close"],
  setup(d, { emit: y }) {
    const m = d, C = y, l = D({}), v = D(15), f = D(!1);
    let u = null;
    const i = h(() => v.value <= 0), _ = h(() => m.catalog.filter((e) => (l.value[e.id] ?? 0) > 0).map((e) => {
      const s = l.value[e.id] ?? 0;
      return {
        item: e,
        qty: s,
        subtotal: s * e.price
      };
    })), b = h(() => _.value.reduce((e, s) => e + s.subtotal, 0)), T = h(() => b.value > 0), I = h(() => m.balance >= b.value), x = h(() => T.value && I.value), w = h(() => T.value ? I.value ? "" : "Недостатньо коштів для оплати кошика." : "Додай хоча б один товар у кошик."), O = (e) => {
      i.value || (l.value[e.id] = (l.value[e.id] ?? 0) + 1);
    }, S = (e) => {
      i.value || (l.value[e.id] = (l.value[e.id] ?? 0) + 1);
    }, B = (e) => {
      if (i.value) return;
      const s = (l.value[e.id] ?? 0) - 1;
      s <= 0 ? delete l.value[e.id] : l.value[e.id] = s;
    }, L = (e) => {
      i.value || delete l.value[e.id];
    }, V = () => {
      if (!x.value) return;
      const e = _.value.map((s) => ({
        id: s.item.id,
        qty: s.qty
      }));
      C("checkout", { total: b.value, items: e });
    }, A = () => {
      u && clearInterval(u), v.value = 15, u = setInterval(() => {
        if (v.value <= 1) {
          v.value = 0, u && clearInterval(u), u = null;
          return;
        }
        v.value -= 1;
      }, 1e3);
    }, q = () => {
      u && (clearInterval(u), u = null);
    }, E = (e, s) => {
      var a, r, p;
      i.value || ((a = e.dataTransfer) == null || a.setData("application/x-shop-item", s.id), (r = e.dataTransfer) == null || r.setData("text/plain", s.id), e.target instanceof HTMLElement && ((p = e.dataTransfer) == null || p.setDragImage(e.target, 20, 20)));
    }, N = (e) => {
      i.value || (e.preventDefault(), f.value = !0);
    }, U = () => {
      f.value = !1;
    }, j = (e) => {
      var r, p;
      if (e.preventDefault(), f.value = !1, i.value) return;
      const s = ((r = e.dataTransfer) == null ? void 0 : r.getData("application/x-shop-item")) || ((p = e.dataTransfer) == null ? void 0 : p.getData("text/plain"));
      if (!s) return;
      const a = m.catalog.find((z) => z.id === s);
      a && O(a);
    }, H = (e) => {
      var r, p;
      const s = e.trim();
      if (!s) return "•";
      const a = s.split(" ");
      return a.length === 1 ? (a[0] ?? "").slice(0, 2).toUpperCase() : `${((r = a[0]) == null ? void 0 : r.charAt(0)) ?? ""}${((p = a[1]) == null ? void 0 : p.charAt(0)) ?? ""}`.toUpperCase();
    };
    return G(
      () => m.isOpen,
      (e) => {
        e ? (l.value = {}, f.value = !1, A()) : q();
      },
      { immediate: !0 }
    ), J(() => {
      q();
    }), (e, s) => (o(), K(P, { to: "body" }, [
      Q(R, { name: "shop-fade" }, {
        default: W(() => [
          d.isOpen ? (o(), n("div", {
            key: 0,
            class: "shop-minigame-overlay",
            onClick: s[0] || (s[0] = X((a) => e.$emit("close"), ["self"]))
          }, [
            t("div", Y, [
              t("header", Z, [
                s[2] || (s[2] = t("h2", { class: "shop-minigame-title" }, "Міні-гра магазину", -1)),
                s[3] || (s[3] = t("p", { class: "shop-minigame-subtitle" }, " Магазин зачиняється — маєш 15 секунд, щоб наповнити кошик. ", -1)),
                t("div", ee, [
                  s[1] || (s[1] = t("span", { class: "shop-timer-label" }, "До закриття магазину", -1)),
                  t("span", {
                    class: k(["shop-timer-value", { "is-urgent": v.value <= 5 }])
                  }, c(v.value) + " с", 3)
                ]),
                i.value ? (o(), n("p", se, " Магазин зачинено — можна лише оплатити кошик. ")) : g("", !0)
              ]),
              t("div", te, [
                t("section", {
                  class: k(["shop-catalog", { "is-closed": i.value }])
                }, [
                  s[4] || (s[4] = t("h3", { class: "shop-section-title" }, "Каталог", -1)),
                  s[5] || (s[5] = t("div", { class: "shop-drag-hint" }, "Перетягни товари у кошик", -1)),
                  t("div", ae, [
                    (o(!0), n($, null, M(d.catalog, (a) => (o(), n("article", {
                      key: a.id,
                      class: k(["shop-item-card", { "is-disabled": i.value }]),
                      draggable: !i.value,
                      onDragstart: (r) => E(r, a)
                    }, [
                      t("div", ie, [
                        a.image ? (o(), n("img", {
                          key: 0,
                          src: a.image,
                          alt: a.name,
                          class: "shop-item-icon-img"
                        }, null, 8, ne)) : (o(), n("span", le, c(H(a.name)), 1))
                      ]),
                      t("div", re, [
                        t("div", ce, c(a.name), 1),
                        a.description ? (o(), n("div", de, c(a.description), 1)) : g("", !0)
                      ]),
                      t("div", ue, [
                        t("span", pe, c(a.price) + " грн", 1)
                      ])
                    ], 42, oe))), 128))
                  ])
                ], 2),
                t("section", {
                  class: k(["shop-cart", { "is-dragover": f.value }]),
                  onDragover: N,
                  onDragleave: U,
                  onDrop: j
                }, [
                  s[8] || (s[8] = t("h3", { class: "shop-section-title" }, "Кошик", -1)),
                  _.value.length === 0 ? (o(), n("div", me, " Кошик порожній. Додай товари. ")) : g("", !0),
                  _.value.length === 0 ? (o(), n("div", ve, " Перетягни товари сюди ")) : (o(), n("div", he, [
                    (o(!0), n($, null, M(_.value, (a) => (o(), n("div", {
                      key: a.item.id,
                      class: "shop-cart-item"
                    }, [
                      t("div", ge, c(a.item.name), 1),
                      t("div", fe, [
                        t("button", {
                          class: "shop-qty-btn",
                          disabled: i.value,
                          onClick: (r) => B(a.item)
                        }, " - ", 8, _e),
                        t("span", be, c(a.qty), 1),
                        t("button", {
                          class: "shop-qty-btn",
                          disabled: i.value,
                          onClick: (r) => S(a.item)
                        }, " + ", 8, ke),
                        t("button", {
                          class: "shop-remove-btn",
                          disabled: i.value,
                          onClick: (r) => L(a.item)
                        }, " Прибрати ", 8, ye)
                      ]),
                      t("div", Ce, c(a.subtotal) + " грн", 1)
                    ]))), 128))
                  ])),
                  t("div", De, [
                    t("div", Te, [
                      s[6] || (s[6] = t("span", null, "Разом:", -1)),
                      t("strong", null, c(b.value) + " грн", 1)
                    ]),
                    t("div", Ie, [
                      s[7] || (s[7] = t("span", null, "Баланс:", -1)),
                      t("strong", null, c(d.balance) + " грн", 1)
                    ]),
                    w.value ? (o(), n("div", xe, c(w.value), 1)) : g("", !0),
                    d.errorMessage ? (o(), n("div", we, c(d.errorMessage), 1)) : g("", !0)
                  ]),
                  t("button", {
                    class: "shop-checkout-btn",
                    disabled: !x.value,
                    onClick: V
                  }, " Оплатити ", 8, qe)
                ], 34)
              ])
            ])
          ])) : g("", !0)
        ]),
        _: 1
      })
    ]));
  }
}), Me = (d, y) => {
  const m = d.__vccOpts || d;
  for (const [C, l] of y)
    m[C] = l;
  return m;
}, Se = /* @__PURE__ */ Me($e, [["__scopeId", "data-v-45b9f960"]]), Be = [
  {
    id: "bread",
    name: "Хліб",
    price: 35,
    category: "base",
    description: "Свіжий батон на щодень.",
    image: "/src/assets/bread.png"
  },
  {
    id: "milk",
    name: "Молоко",
    price: 52,
    category: "dairy",
    description: "1 л, 2.5% жирності.",
    image: "/src/assets/milk.png"
  },
  {
    id: "eggs",
    name: "Яйця",
    price: 78,
    category: "base",
    description: "Десяток яєць.",
    image: "/src/assets/eggs.png"
  },
  {
    id: "cheese",
    name: "Сир",
    price: 120,
    category: "dairy",
    description: "Твердий сир 200 г.",
    image: "/src/assets/cheese.png"
  },
  {
    id: "chicken",
    name: "Куряче філе",
    price: 165,
    category: "meat",
    description: "Філе 500 г.",
    image: "/src/assets/chicken.png"
  },
  {
    id: "pasta",
    name: "Паста",
    price: 48,
    category: "base",
    description: "Спагеті 400 г.",
    image: "/src/assets/pasta.png"
  },
  {
    id: "vegetables",
    name: "Овочі",
    price: 90,
    category: "produce",
    description: "Мікс сезонних овочів.",
    image: "/src/assets/vegetables.png"
  },
  {
    id: "fruit",
    name: "Фрукти",
    price: 110,
    category: "produce",
    description: "Кілограм яблук.",
    image: "/src/assets/fruits.png"
  },
  {
    id: "oil",
    name: "Олія",
    price: 75,
    category: "base",
    description: "Соняшникова олія 0.9 л.",
    image: "/src/assets/oil.png"
  },
  {
    id: "juice",
    name: "Сік",
    price: 65,
    category: "drinks",
    description: "Пакет 1 л.",
    image: "/src/assets/juice.png"
  }
];
export {
  Se as ShopMiniGame,
  Se as default,
  Be as shopCatalog
};
