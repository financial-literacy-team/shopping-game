<template>
  <Teleport to="body">
    <Transition name="shop-fade">
      <div v-if="isOpen" class="shop-minigame-overlay" @click.self="$emit('close')">
        <div class="shop-minigame-card">
          <header class="shop-minigame-header">
            <h2 class="shop-minigame-title">Міні-гра магазину</h2>
            <p class="shop-minigame-subtitle">
              Магазин зачиняється — маєш 15 секунд, щоб наповнити кошик.
            </p>
            <div class="shop-timer-row">
              <span class="shop-timer-label">До закриття магазину</span>
              <span
                class="shop-timer-value"
                :class="{ 'is-urgent': timeLeft <= 5 }"
                >{{ timeLeft }} с</span
              >
            </div>
            <p v-if="isShopClosed" class="shop-closed-note">
              Магазин зачинено — можна лише оплатити кошик.
            </p>
          </header>

          <div class="shop-minigame-body">
            <section
              class="shop-catalog"
              :class="{ 'is-closed': isShopClosed }"
            >
              <h3 class="shop-section-title">Каталог</h3>
              <div class="shop-drag-hint">Перетягни товари у кошик</div>
              <div class="shop-item-grid">
                <article
                  v-for="item in catalog"
                  :key="item.id"
                  class="shop-item-card"
                  :class="{ 'is-disabled': isShopClosed }"
                  :draggable="!isShopClosed"
                  @dragstart="handleDragStart($event, item)"
                >
                  <div class="shop-item-icon">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="shop-item-icon-img"
                    />
                    <span v-else class="shop-item-icon-text">{{
                      getInitials(item.name)
                    }}</span>
                  </div>
                  <div class="shop-item-info">
                    <div class="shop-item-name">{{ item.name }}</div>
                    <div v-if="item.description" class="shop-item-desc">
                      {{ item.description }}
                    </div>
                  </div>
                  <div class="shop-item-meta">
                    <span class="shop-item-price">{{ item.price }} грн</span>
                  </div>
                </article>
              </div>
            </section>

            <section
              class="shop-cart"
              :class="{ 'is-dragover': isDragOver }"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
            >
              <h3 class="shop-section-title">Кошик</h3>
              <div v-if="cartItems.length === 0" class="shop-empty">
                Кошик порожній. Додай товари.
              </div>
              <div v-if="cartItems.length === 0" class="shop-drop-hint">
                Перетягни товари сюди
              </div>

              <div v-else class="shop-cart-list">
                <div
                  v-for="entry in cartItems"
                  :key="entry.item.id"
                  class="shop-cart-item"
                >
                  <div class="shop-cart-name">{{ entry.item.name }}</div>
                  <div class="shop-cart-controls">
                    <button
                      class="shop-qty-btn"
                      :disabled="isShopClosed"
                      @click="decrement(entry.item)"
                    >
                      -
                    </button>
                    <span class="shop-qty-value">{{ entry.qty }}</span>
                    <button
                      class="shop-qty-btn"
                      :disabled="isShopClosed"
                      @click="increment(entry.item)"
                    >
                      +
                    </button>
                    <button
                      class="shop-remove-btn"
                      :disabled="isShopClosed"
                      @click="remove(entry.item)"
                    >
                      Прибрати
                    </button>
                  </div>
                  <div class="shop-cart-subtotal">{{ entry.subtotal }} грн</div>
                </div>
              </div>

              <div class="shop-cart-summary">
                <div class="shop-summary-row">
                  <span>Разом:</span>
                  <strong>{{ total }} грн</strong>
                </div>
                <div class="shop-summary-row">
                  <span>Баланс:</span>
                  <strong>{{ balance }} грн</strong>
                </div>
                <div v-if="checkoutHint" class="shop-warning">
                  {{ checkoutHint }}
                </div>
                <div v-if="errorMessage" class="shop-warning">
                  {{ errorMessage }}
                </div>
              </div>

              <button
                class="shop-checkout-btn"
                :disabled="!canCheckout"
                @click="checkout"
              >
                Оплатити
              </button>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import type { ShopItem } from "../shopCatalog";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    catalog: ShopItem[];
    balance: number;
    errorMessage?: string | null;
  }>(),
  {
    isOpen: false,
    catalog: () => [],
    balance: 0,
    errorMessage: null,
  }
);

const emit = defineEmits<{
  (e: "checkout", payload: { total: number; items: Array<{ id: string; qty: number }> }): void;
  (e: "close"): void;
}>();

const cart = ref<Record<string, number>>({});
const timeLeft = ref(15);
const isDragOver = ref(false);
let timerId: ReturnType<typeof setInterval> | null = null;

const isShopClosed = computed(() => timeLeft.value <= 0);

const cartItems = computed(() => {
  return props.catalog
    .filter((item: ShopItem) => (cart.value[item.id] ?? 0) > 0)
    .map((item: ShopItem) => {
      const qty = cart.value[item.id] ?? 0;
      return {
        item,
        qty,
        subtotal: qty * item.price,
      };
    });
});

const total = computed(() => {
  return cartItems.value.reduce((sum: number, entry: { subtotal: number }) => sum + entry.subtotal, 0);
});

const hasItems = computed(() => total.value > 0);
const isAffordable = computed(() => props.balance >= total.value);
const canCheckout = computed(() => hasItems.value && isAffordable.value);

const checkoutHint = computed(() => {
  if (!hasItems.value) return "Додай хоча б один товар у кошик.";
  if (!isAffordable.value) return "Недостатньо коштів для оплати кошика.";
  return "";
});

const addToCart = (item: ShopItem) => {
  if (isShopClosed.value) return;
  cart.value[item.id] = (cart.value[item.id] ?? 0) + 1;
};

const increment = (item: ShopItem) => {
  if (isShopClosed.value) return;
  cart.value[item.id] = (cart.value[item.id] ?? 0) + 1;
};

const decrement = (item: ShopItem) => {
  if (isShopClosed.value) return;
  const nextValue = (cart.value[item.id] ?? 0) - 1;
  if (nextValue <= 0) {
    delete cart.value[item.id];
  } else {
    cart.value[item.id] = nextValue;
  }
};

const remove = (item: ShopItem) => {
  if (isShopClosed.value) return;
  delete cart.value[item.id];
};

const checkout = () => {
  if (!canCheckout.value) return;
  const items = cartItems.value.map((entry: { item: ShopItem; qty: number }) => ({
    id: entry.item.id,
    qty: entry.qty,
  }));
  emit("checkout", { total: total.value, items });
};

const startTimer = () => {
  if (timerId) clearInterval(timerId);
  timeLeft.value = 15;
  timerId = setInterval(() => {
    if (timeLeft.value <= 1) {
      timeLeft.value = 0;
      if (timerId) clearInterval(timerId);
      timerId = null;
      return;
    }
    timeLeft.value -= 1;
  }, 1000);
};

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};

const handleDragStart = (event: DragEvent, item: ShopItem) => {
  if (isShopClosed.value) return;
  event.dataTransfer?.setData("application/x-shop-item", item.id);
  event.dataTransfer?.setData("text/plain", item.id);
  if (event.target instanceof HTMLElement) {
    event.dataTransfer?.setDragImage(event.target, 20, 20);
  }
};

const handleDragOver = (event: DragEvent) => {
  if (isShopClosed.value) return;
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  if (isShopClosed.value) return;
  const id =
    event.dataTransfer?.getData("application/x-shop-item") ||
    event.dataTransfer?.getData("text/plain");
  if (!id) return;
  const item = props.catalog.find((entry: ShopItem) => entry.id === id);
  if (!item) return;
  addToCart(item);
};

const getInitials = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "•";
  const parts = trimmed.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

watch(
  () => props.isOpen,
  (isOpen: boolean) => {
    if (isOpen) {
      cart.value = {};
      isDragOver.value = false;
      startTimer();
    } else {
      stopTimer();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.shop-minigame-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 14, 10, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 260;
  pointer-events: auto;
}

.shop-minigame-card {
  width: min(62vw, 720px);
  max-height: 70vh;
  background: #fff6e8;
  border-radius: 2vh;
  border: 0.35vh solid #caa677;
  box-shadow: 0 1.2vh 2.5vh rgba(0, 0, 0, 0.35);
  padding: 2.2vh 2vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.shop-minigame-header {
  display: flex;
  flex-direction: column;
  gap: 0.4vh;
}

.shop-minigame-title {
  margin: 0;
  font-size: 3vh;
  font-weight: 900;
  color: #4a2f1c;
}

.shop-minigame-subtitle {
  margin: 0;
  font-size: 2vh;
  font-weight: 600;
  color: #6c4b35;
}

.shop-timer-row {
  display: flex;
  align-items: center;
  gap: 0.4vh;
  font-weight: 800;
  color: #4a2f1c;
}

.shop-timer-label {
  font-size: 1.8vh;
}

.shop-timer-value {
  font-size: 2.2vh;
  font-weight: 900;
  color: #2f8a6b;
}

.shop-timer-value.is-urgent {
  color: #b12f2f;
}

.shop-closed-note {
  margin: 0.4vh 0 0;
  font-size: 1.8vh;
  font-weight: 800;
  color: #b12f2f;
}

.shop-minigame-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2vh;
  overflow: visible;
  padding-right: 0;
}

.shop-section-title {
  margin: 0 0 1vh;
  font-size: 2.2vh;
  font-weight: 900;
  color: #4a2f1c;
}

.shop-catalog.is-closed {
  opacity: 0.6;
  filter: grayscale(0.2);
}

.shop-drag-hint {
  font-size: 1.7vh;
  font-weight: 700;
  color: #7a5a40;
  margin-bottom: 0.6vh;
}

.shop-item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.4vh;
  max-height: 30vh;
  overflow: auto;
  padding-right: 0.6vw;
}

.shop-item-card {
  background: #fffdf7;
  border-radius: 1.6vh;
  border: 0.25vh solid #d9c3a1;
  padding: 1.4vh 1vw;
  display: grid;
  grid-template-columns: 5vh 1fr;
  gap: 0.8vh 1vw;
  align-items: center;
  box-shadow: 0 0.4vh 0 rgba(0, 0, 0, 0.08);
  cursor: grab;
}

.shop-item-card.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.shop-item-icon {
  width: 5vh;
  height: 5vh;
  border-radius: 1.2vh;
  background: #ffe6c9;
  border: 0.2vh solid #d7b38c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #6b4a30;
  overflow: hidden;
}

.shop-item-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.shop-item-icon-text {
  font-size: 1.8vh;
}

.shop-item-name {
  font-size: 2.1vh;
  font-weight: 800;
  color: #3b2416;
}

.shop-item-desc {
  font-size: 1.7vh;
  color: #6e4f38;
}

.shop-item-meta {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1vh;
}

.shop-item-price {
  font-weight: 900;
  font-size: 2vh;
  color: #8a3177;
}

.shop-cart {
  background: #fff9ef;
  border-radius: 1.8vh;
  border: 0.25vh solid #d9c3a1;
  padding: 1.6vh 1.4vw;
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
  max-height: 52vh;
  overflow: hidden;
}

.shop-cart.is-dragover {
  border-color: #8a3177;
  box-shadow: 0 0 0 0.3vh rgba(138, 49, 119, 0.15);
}

.shop-empty {
  font-size: 1.9vh;
  color: #6b4a30;
}

.shop-drop-hint {
  font-size: 1.8vh;
  font-weight: 700;
  color: #8a3177;
  padding: 1vh 0;
}

.shop-cart-list {
  display: flex;
  flex-direction: column;
  gap: 1.1vh;
  overflow: auto;
  padding-right: 0.4vw;
  max-height: 24vh;
}

.shop-cart-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.8vh 1vw;
  align-items: center;
  background: #fff3e0;
  border: 0.2vh solid #d2b38a;
  border-radius: 1.2vh;
  padding: 1.2vh 1vw;
  min-height: 6vh;
  box-shadow: 0 0.35vh 0 rgba(146, 108, 70, 0.2);
}

.shop-cart-name {
  font-weight: 800;
  color: #3b2416;
  font-size: 2.2vh;
}

.shop-cart-controls {
  display: flex;
  align-items: center;
  gap: 0.6vw;
}

.shop-qty-btn {
  width: 3vh;
  height: 3vh;
  border-radius: 0.8vh;
  border: 0.2vh solid #6b4a30;
  background: #fff4dd;
  font-weight: 900;
  cursor: pointer;
}

.shop-qty-value {
  font-weight: 800;
  font-size: 1.9vh;
}

.shop-remove-btn {
  background: transparent;
  border: none;
  color: #a65440;
  font-weight: 800;
  cursor: pointer;
}

.shop-cart-subtotal {
  font-size: 2.1vh;
  font-weight: 900;
  color: #8a3177;
  justify-self: end;
}

.shop-cart-summary {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  padding-top: 0.6vh;
  border-top: 0.25vh solid #d5b892;
}

.shop-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 2vh;
  color: #4a2f1c;
}

.shop-warning {
  color: #a63d3d;
  font-weight: 800;
  font-size: 1.8vh;
}

.shop-checkout-btn {
  font-size: 2.4vh;
  font-weight: 900;
  color: #ffffff;
  background-color: #2f8a6b;
  border: none;
  border-radius: 1.2vh;
  padding: 1.2vh 1.6vw;
  min-height: 5.6vh;
  width: 100%;
  cursor: pointer;
  box-shadow: 0 0.5vh 0 rgba(47, 138, 107, 0.35);
  transition: transform 0.1s ease, opacity 0.2s ease;
}

.shop-checkout-btn:hover {
  transform: translateY(-0.15vh);
}

.shop-checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.shop-fade-enter-active,
.shop-fade-leave-active {
  transition: opacity 0.2s ease;
}

.shop-fade-enter-from,
.shop-fade-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .shop-minigame-card {
    width: 90vw;
    max-height: 82vh;
    padding: 2vh 4vw;
  }
}
</style>