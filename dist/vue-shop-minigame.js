import { defineComponent as Q, ref as T, computed as m, watch as W, onUnmounted as X, openBlock as a, createBlock as Z, Teleport as ee, createVNode as se, Transition as te, withCtx as ie, createElementBlock as o, withModifiers as ae, createElementVNode as s, toDisplayString as l, Fragment as L, renderList as A, unref as $, normalizeClass as y, createCommentVNode as h } from "vue";
const H = [
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
], oe = "UAH", le = [
  {
    id: "easy",
    title: "Легкий",
    description: "Спокійно обирай товари та стеж за бюджетом",
    budget: 500,
    timeLimit: null
  },
  {
    id: "medium",
    title: "Середній",
    description: "Більший бюджет і ті самі товари — плануй покупки",
    budget: 1200,
    timeLimit: null
  },
  {
    id: "hard",
    title: "Важкий",
    description: "Встигни зібрати кошик за обмежений час",
    budget: 800,
    timeLimit: 15
  }
], ne = { class: "shop-minigame-card" }, ce = { class: "shop-minigame-header" }, re = { class: "shop-minigame-subtitle" }, de = {
  key: 0,
  class: "shop-difficulty-picker"
}, ue = ["onClick"], pe = { class: "shop-difficulty-title" }, me = { class: "shop-difficulty-description" }, ve = { class: "shop-difficulty-budget" }, he = { class: "shop-difficulty-timer" }, ge = { class: "shop-game-toolbar" }, fe = { class: "shop-current-difficulty" }, _e = {
  key: 0,
  class: "shop-timer-row"
}, ye = {
  key: 1,
  class: "shop-closed-note"
}, be = { class: "shop-minigame-body" }, ke = { class: "shop-item-grid" }, Ce = ["draggable", "onDragstart"], De = { class: "shop-item-icon" }, Te = ["src", "alt"], Le = {
  key: 1,
  class: "shop-item-icon-text"
}, Ue = { class: "shop-item-info" }, xe = { class: "shop-item-name" }, Ae = {
  key: 0,
  class: "shop-item-desc"
}, He = { class: "shop-item-meta" }, Ie = { class: "shop-item-price" }, qe = {
  key: 0,
  class: "shop-empty"
}, we = {
  key: 1,
  class: "shop-drop-hint"
}, Oe = {
  key: 2,
  class: "shop-cart-list"
}, Be = { class: "shop-cart-name" }, Se = { class: "shop-cart-controls" }, $e = ["disabled", "onClick"], Ee = { class: "shop-qty-value" }, Ne = ["disabled", "onClick"], Ve = ["disabled", "onClick"], Me = { class: "shop-cart-subtotal" }, je = { class: "shop-cart-summary" }, Ge = { class: "shop-summary-row" }, Re = { class: "shop-summary-row" }, ze = {
  key: 0,
  class: "shop-warning"
}, Fe = ["disabled"], Pe = /* @__PURE__ */ Q({
  __name: "Shop",
  props: {
    isOpen: { type: Boolean, default: !1 }
  },
  emits: ["completed", "close"],
  setup(g, { emit: U }) {
    const b = g, k = U, r = T(null), u = T({}), d = T(null), f = T(!1);
    let C = null;
    const c = m(
      () => d.value !== null && d.value <= 0
    ), _ = m(
      () => H.filter((e) => (u.value[e.id] ?? 0) > 0).map((e) => {
        const i = u.value[e.id] ?? 0;
        return {
          item: e,
          qty: i,
          subtotal: i * e.price
        };
      })
    ), D = m(
      () => _.value.reduce(
        (e, i) => e + i.subtotal,
        0
      )
    ), x = m(
      () => {
        var e;
        return (((e = r.value) == null ? void 0 : e.budget) ?? 0) - D.value;
      }
    ), I = m(() => D.value > 0), q = m(
      () => x.value >= 0
    ), w = m(
      () => r.value !== null && I.value && q.value
    ), O = m(() => I.value ? q.value ? "" : "Недостатньо коштів у бюджеті. Прибери частину товарів." : "Додай хоча б один товар у кошик."), v = () => {
      C !== null && (clearInterval(C), C = null);
    }, E = (e) => {
      v(), d.value = e, C = setInterval(() => {
        if (d.value !== null) {
          if (d.value <= 1) {
            d.value = 0, v();
            return;
          }
          d.value -= 1;
        }
      }, 1e3);
    }, B = () => {
      v(), r.value = null, u.value = {}, d.value = null, f.value = !1;
    }, N = (e) => {
      r.value = e, u.value = {}, e.timeLimit !== null ? E(e.timeLimit) : (v(), d.value = null);
    }, V = () => {
      B();
    }, S = (e) => {
      c.value || (u.value[e.id] = (u.value[e.id] ?? 0) + 1);
    }, M = (e) => {
      S(e);
    }, j = (e) => {
      if (c.value) return;
      const i = (u.value[e.id] ?? 0) - 1;
      i <= 0 ? delete u.value[e.id] : u.value[e.id] = i;
    }, G = (e) => {
      c.value || delete u.value[e.id];
    }, R = () => {
      if (!w.value || !r.value)
        return;
      const e = {
        difficulty: r.value.id,
        spent: D.value,
        remainingBudget: x.value,
        currency: oe,
        items: _.value.map((i) => ({
          id: i.item.id,
          qty: i.qty
        })),
        completed: !0
      };
      k("completed", e);
    }, z = (e, i) => {
      var t, n, p;
      c.value || ((t = e.dataTransfer) == null || t.setData(
        "application/x-shop-item",
        i.id
      ), (n = e.dataTransfer) == null || n.setData(
        "text/plain",
        i.id
      ), e.target instanceof HTMLElement && ((p = e.dataTransfer) == null || p.setDragImage(
        e.target,
        20,
        20
      )));
    }, F = (e) => {
      c.value || (e.preventDefault(), f.value = !0);
    }, P = () => {
      f.value = !1;
    }, Y = (e) => {
      var n, p;
      if (e.preventDefault(), f.value = !1, c.value) return;
      const i = ((n = e.dataTransfer) == null ? void 0 : n.getData(
        "application/x-shop-item"
      )) || ((p = e.dataTransfer) == null ? void 0 : p.getData("text/plain"));
      if (!i) return;
      const t = H.find(
        (K) => K.id === i
      );
      t && S(t);
    }, J = (e) => {
      var n, p;
      const i = e.trim();
      if (!i) return "•";
      const t = i.split(" ");
      return t.length === 1 ? (t[0] ?? "").slice(0, 2).toUpperCase() : ((((n = t[0]) == null ? void 0 : n.charAt(0)) ?? "") + (((p = t[1]) == null ? void 0 : p.charAt(0)) ?? "")).toUpperCase();
    };
    return W(
      () => b.isOpen,
      (e) => {
        e ? B() : v();
      },
      { immediate: !0 }
    ), X(() => {
      v();
    }), (e, i) => (a(), Z(ee, { to: "body" }, [
      se(te, { name: "shop-fade" }, {
        default: ie(() => [
          g.isOpen ? (a(), o("div", {
            key: 0,
            class: "shop-minigame-overlay",
            onClick: i[0] || (i[0] = ae((t) => k("close"), ["self"]))
          }, [
            s("div", ne, [
              s("header", ce, [
                i[1] || (i[1] = s("h2", { class: "shop-minigame-title" }, "Міні-гра магазину", -1)),
                s("p", re, l(r.value ? "Збери кошик у межах свого бюджету." : "Обери рівень складності, щоб почати покупки."), 1)
              ]),
              r.value ? (a(), o(L, { key: 1 }, [
                s("div", ge, [
                  s("div", fe, [
                    s("strong", null, " Рівень: " + l(r.value.title), 1),
                    s("span", null, " Бюджет: " + l(r.value.budget) + " UAH ", 1)
                  ]),
                  s("button", {
                    type: "button",
                    class: "shop-change-difficulty",
                    onClick: V
                  }, " Змінити складність ")
                ]),
                d.value !== null ? (a(), o("div", _e, [
                  i[3] || (i[3] = s("span", { class: "shop-timer-label" }, " До закриття магазину ", -1)),
                  s("span", {
                    class: y(["shop-timer-value", { "is-urgent": d.value <= 5 }])
                  }, l(d.value) + " с ", 3)
                ])) : h("", !0),
                c.value ? (a(), o("p", ye, " Час вичерпано — можна оплатити вже зібраний кошик. ")) : h("", !0),
                s("div", be, [
                  s("section", {
                    class: y(["shop-catalog", { "is-closed": c.value }])
                  }, [
                    i[4] || (i[4] = s("h3", { class: "shop-section-title" }, "Каталог", -1)),
                    i[5] || (i[5] = s("div", { class: "shop-drag-hint" }, " Перетягни товари у кошик ", -1)),
                    s("div", ke, [
                      (a(!0), o(L, null, A($(H), (t) => (a(), o("article", {
                        key: t.id,
                        class: y(["shop-item-card", { "is-disabled": c.value }]),
                        draggable: !c.value,
                        onDragstart: (n) => z(n, t)
                      }, [
                        s("div", De, [
                          t.image ? (a(), o("img", {
                            key: 0,
                            src: t.image,
                            alt: t.name,
                            class: "shop-item-icon-img"
                          }, null, 8, Te)) : (a(), o("span", Le, l(J(t.name)), 1))
                        ]),
                        s("div", Ue, [
                          s("div", xe, l(t.name), 1),
                          t.description ? (a(), o("div", Ae, l(t.description), 1)) : h("", !0)
                        ]),
                        s("div", He, [
                          s("span", Ie, l(t.price) + " UAH ", 1)
                        ])
                      ], 42, Ce))), 128))
                    ])
                  ], 2),
                  s("section", {
                    class: y(["shop-cart", { "is-dragover": f.value }]),
                    onDragover: F,
                    onDragleave: P,
                    onDrop: Y
                  }, [
                    i[8] || (i[8] = s("h3", { class: "shop-section-title" }, "Кошик", -1)),
                    _.value.length === 0 ? (a(), o("div", qe, " Кошик порожній. Додай товари. ")) : h("", !0),
                    _.value.length === 0 ? (a(), o("div", we, " Перетягни товари сюди ")) : (a(), o("div", Oe, [
                      (a(!0), o(L, null, A(_.value, (t) => (a(), o("div", {
                        key: t.item.id,
                        class: "shop-cart-item"
                      }, [
                        s("div", Be, l(t.item.name), 1),
                        s("div", Se, [
                          s("button", {
                            type: "button",
                            class: "shop-qty-btn",
                            disabled: c.value,
                            onClick: (n) => j(t.item)
                          }, " - ", 8, $e),
                          s("span", Ee, l(t.qty), 1),
                          s("button", {
                            type: "button",
                            class: "shop-qty-btn",
                            disabled: c.value,
                            onClick: (n) => M(t.item)
                          }, " + ", 8, Ne),
                          s("button", {
                            type: "button",
                            class: "shop-remove-btn",
                            disabled: c.value,
                            onClick: (n) => G(t.item)
                          }, " Прибрати ", 8, Ve)
                        ]),
                        s("div", Me, l(t.subtotal) + " UAH ", 1)
                      ]))), 128))
                    ])),
                    s("div", je, [
                      s("div", Ge, [
                        i[6] || (i[6] = s("span", null, "Разом:", -1)),
                        s("strong", null, l(D.value) + " UAH", 1)
                      ]),
                      s("div", Re, [
                        i[7] || (i[7] = s("span", null, "Залишок бюджету:", -1)),
                        s("strong", null, l(x.value) + " UAH", 1)
                      ]),
                      O.value ? (a(), o("div", ze, l(O.value), 1)) : h("", !0)
                    ]),
                    s("button", {
                      type: "button",
                      class: "shop-checkout-btn",
                      disabled: !w.value,
                      onClick: R
                    }, " Завершити покупки ", 8, Fe)
                  ], 34)
                ])
              ], 64)) : (a(), o("section", de, [
                i[2] || (i[2] = s("h3", { class: "shop-section-title" }, "Обери складність", -1)),
                (a(!0), o(L, null, A($(le), (t) => (a(), o("button", {
                  key: t.id,
                  type: "button",
                  class: y(["shop-difficulty-option", "difficulty-" + t.id]),
                  onClick: (n) => N(t)
                }, [
                  s("span", pe, l(t.title), 1),
                  s("span", me, l(t.description), 1),
                  s("span", ve, " Бюджет: " + l(t.budget) + " UAH ", 1),
                  s("span", he, l(t.timeLimit !== null ? `Час: ${t.timeLimit} с` : "Без обмеження часу"), 1)
                ], 10, ue))), 128))
              ]))
            ])
          ])) : h("", !0)
        ]),
        _: 1
      })
    ]));
  }
}), Ye = (g, U) => {
  const b = g.__vccOpts || g;
  for (const [k, r] of U)
    b[k] = r;
  return b;
}, Ke = /* @__PURE__ */ Ye(Pe, [["__scopeId", "data-v-f58004ad"]]);
export {
  oe as SHOP_CURRENCY,
  Ke as ShopMiniGame,
  Ke as default,
  H as shopCatalog,
  le as shopDifficulties
};
