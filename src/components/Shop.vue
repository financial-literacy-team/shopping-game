
<template>
  <Teleport to="body">
    <Transition name="shop-fade">
      <div
        v-if="isOpen"
        class="shop-minigame-overlay"
        @click.self="emit('close')"
      >
        <div class="shop-minigame-card">
          <header class="shop-minigame-header">
            <h2 class="shop-minigame-title">Міні-гра магазину</h2>
            <p class="shop-minigame-subtitle">
              {{
                selectedDifficulty
                  ? "Збери кошик у межах свого бюджету."
                  : "Обери рівень складності, щоб почати покупки."
              }}
            </p>
          </header>

          <!-- Difficulty selection -->
          <section
            v-if="!selectedDifficulty"
            class="shop-difficulty-picker"
          >
            <h3 class="shop-section-title">Обери складність</h3>

            <button
              v-for="option in shopDifficulties"
              :key="option.id"
              type="button"
              class="shop-difficulty-option"
              :class="'difficulty-' + option.id"
              @click="selectDifficulty(option)"
            >
              <span class="shop-difficulty-title">
                {{ option.title }}
              </span>

              <span class="shop-difficulty-description">
                {{ option.description }}
              </span>

              <span class="shop-difficulty-budget">
                Бюджет: {{ option.budget }} UAH
              </span>

              <span class="shop-difficulty-timer">
                {{
                  option.timeLimit !== null
                    ? `Час: ${option.timeLimit} с`
                    : "Без обмеження часу"
                }}
              </span>
            </button>
          </section>

          <!-- Main shopping activity -->
          <template v-else>
            <div class="shop-game-toolbar">
              <div class="shop-current-difficulty">
                <strong>
                  Рівень: {{ selectedDifficulty.title }}
                </strong>
                <span>
                  Бюджет: {{ selectedDifficulty.budget }} UAH
                </span>
              </div>

              <button
                type="button"
                class="shop-change-difficulty"
                @click="backToDifficulty"
              >
                Змінити складність
              </button>
            </div>

            <!-- Timer exists only for Hard -->
            <div
              v-if="timeLeft !== null"
              class="shop-timer-row"
            >
              <span class="shop-timer-label">
                До закриття магазину
              </span>

              <span
                class="shop-timer-value"
                :class="{ 'is-urgent': timeLeft <= 5 }"
              >
                {{ timeLeft }} с
              </span>
            </div>

            <p
              v-if="isShopClosed"
              class="shop-closed-note"
            >
              Час вичерпано — можна оплатити вже зібраний кошик.
            </p>

            <div class="shop-minigame-body">
              <section
                class="shop-catalog"
                :class="{ 'is-closed': isShopClosed }"
              >
                <h3 class="shop-section-title">Каталог</h3>

                <div class="shop-drag-hint">
                  Перетягни товари у кошик
                </div>

                <div class="shop-item-grid">
                  <article
                    v-for="item in shopCatalog"
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

                      <span
                        v-else
                        class="shop-item-icon-text"
                      >
                        {{ getInitials(item.name) }}
                      </span>
                    </div>

                    <div class="shop-item-info">
                      <div class="shop-item-name">
                        {{ item.name }}
                      </div>

                      <div
                        v-if="item.description"
                        class="shop-item-desc"
                      >
                        {{ item.description }}
                      </div>
                    </div>

                    <div class="shop-item-meta">
                      <span class="shop-item-price">
                        {{ item.price }} UAH
                      </span>
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

                <div
                  v-if="cartItems.length === 0"
                  class="shop-empty"
                >
                  Кошик порожній. Додай товари.
                </div>

                <div
                  v-if="cartItems.length === 0"
                  class="shop-drop-hint"
                >
                  Перетягни товари сюди
                </div>

                <div
                  v-else
                  class="shop-cart-list"
                >
                  <div
                    v-for="entry in cartItems"
                    :key="entry.item.id"
                    class="shop-cart-item"
                  >
                    <div class="shop-cart-name">
                      {{ entry.item.name }}
                    </div>

                    <div class="shop-cart-controls">
                      <button
                        type="button"
                        class="shop-qty-btn"
                        :disabled="isShopClosed"
                        @click="decrement(entry.item)"
                      >
                        -
                      </button>

                      <span class="shop-qty-value">
                        {{ entry.qty }}
                      </span>

                      <button
                        type="button"
                        class="shop-qty-btn"
                        :disabled="isShopClosed"
                        @click="increment(entry.item)"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        class="shop-remove-btn"
                        :disabled="isShopClosed"
                        @click="remove(entry.item)"
                      >
                        Прибрати
                      </button>
                    </div>

                    <div class="shop-cart-subtotal">
                      {{ entry.subtotal }} UAH
                    </div>
                  </div>
                </div>

                <div class="shop-cart-summary">
                  <div class="shop-summary-row">
                    <span>Разом:</span>
                    <strong>{{ total }} UAH</strong>
                  </div>

                  <div class="shop-summary-row">
                    <span>Залишок бюджету:</span>
                    <strong>{{ remainingBudget }} UAH</strong>
                  </div>

                  <div
                    v-if="checkoutHint"
                    class="shop-warning"
                  >
                    {{ checkoutHint }}
                  </div>
                </div>

                <button
                  type="button"
                  class="shop-checkout-btn"
                  :disabled="!canCheckout"
                  @click="checkout"
                >
                  Завершити покупки
                </button>
              </section>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  onUnmounted,
  ref,
  watch,
} from "vue";

import { shopCatalog } from "../shopCatalog";
import type { ShopItem } from "../shopCatalog";

import {
  SHOP_CURRENCY,
  shopDifficulties,
} from "../shopScenarios";

import type {
  ShopDifficultyOption,
  ShopGameResult,
} from "../shopScenarios";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
  }>(),
  {
    isOpen: false,
  }
);

const emit = defineEmits<{
  (event: "completed", result: ShopGameResult): void;
  (event: "close"): void;
}>();

// Game state
const selectedDifficulty = ref<ShopDifficultyOption | null>(null);
const cart = ref<Record<string, number>>({});
const timeLeft = ref<number | null>(null);
const isDragOver = ref(false);

let timerId: ReturnType<typeof setInterval> | null = null;

// Timer is considered expired only when a timer exists.
// Easy and Medium therefore never become closed.
const isShopClosed = computed(
  () => timeLeft.value !== null && timeLeft.value <= 0
);

// Cart calculations
const cartItems = computed(() =>
  shopCatalog
    .filter((item: ShopItem) => (cart.value[item.id] ?? 0) > 0)
    .map((item: ShopItem) => {
      const qty = cart.value[item.id] ?? 0;

      return {
        item,
        qty,
        subtotal: qty * item.price,
      };
    })
);

const total = computed(() =>
  cartItems.value.reduce(
    (sum, entry) => sum + entry.subtotal,
    0
  )
);

const remainingBudget = computed(
  () => (selectedDifficulty.value?.budget ?? 0) - total.value
);

const hasItems = computed(() => total.value > 0);

const isAffordable = computed(
  () => remainingBudget.value >= 0
);

const canCheckout = computed(
  () =>
    selectedDifficulty.value !== null &&
    hasItems.value &&
    isAffordable.value
);

const checkoutHint = computed(() => {
  if (!hasItems.value) {
    return "Додай хоча б один товар у кошик.";
  }

  if (!isAffordable.value) {
    return "Недостатньо коштів у бюджеті. Прибери частину товарів.";
  }

  return "";
});

// Timer management
const stopTimer = () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
};

const startTimer = (seconds: number) => {
  stopTimer();

  timeLeft.value = seconds;

  timerId = setInterval(() => {
    if (timeLeft.value === null) return;

    if (timeLeft.value <= 1) {
      timeLeft.value = 0;
      stopTimer();
      return;
    }

    timeLeft.value -= 1;
  }, 1000);
};

// Reset the activity when it is opened again
const resetGame = () => {
  stopTimer();

  selectedDifficulty.value = null;
  cart.value = {};
  timeLeft.value = null;
  isDragOver.value = false;
};

// Difficulty selection
const selectDifficulty = (
  option: ShopDifficultyOption
) => {
  selectedDifficulty.value = option;
  cart.value = {};

  if (option.timeLimit !== null) {
    startTimer(option.timeLimit);
  } else {
    stopTimer();
    timeLeft.value = null;
  }
};

const backToDifficulty = () => {
  resetGame();
};

// Cart operations
const addToCart = (item: ShopItem) => {
  if (isShopClosed.value) return;

  cart.value[item.id] =
    (cart.value[item.id] ?? 0) + 1;
};

const increment = (item: ShopItem) => {
  addToCart(item);
};

const decrement = (item: ShopItem) => {
  if (isShopClosed.value) return;

  const nextValue =
    (cart.value[item.id] ?? 0) - 1;

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

// Emit the result to the host application.
// This component does not update the host's balance or state.
const checkout = () => {
  if (!canCheckout.value || !selectedDifficulty.value) {
    return;
  }

  const result: ShopGameResult = {
    difficulty: selectedDifficulty.value.id,
    spent: total.value,
    remainingBudget: remainingBudget.value,
    currency: SHOP_CURRENCY,
    items: cartItems.value.map((entry) => ({
      id: entry.item.id,
      qty: entry.qty,
    })),
    completed: true,
  };

  emit("completed", result);
};

// Drag and drop
const handleDragStart = (
  event: DragEvent,
  item: ShopItem
) => {
  if (isShopClosed.value) return;

  event.dataTransfer?.setData(
    "application/x-shop-item",
    item.id
  );

  event.dataTransfer?.setData(
    "text/plain",
    item.id
  );

  if (event.target instanceof HTMLElement) {
    event.dataTransfer?.setDragImage(
      event.target,
      20,
      20
    );
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
    event.dataTransfer?.getData(
      "application/x-shop-item"
    ) ||
    event.dataTransfer?.getData("text/plain");

  if (!id) return;

  const item = shopCatalog.find(
    (entry: ShopItem) => entry.id === id
  );

  if (item) {
    addToCart(item);
  }
};

// Fallback icon text
const getInitials = (name: string) => {
  const trimmed = name.trim();

  if (!trimmed) return "•";

  const parts = trimmed.split(" ");

  if (parts.length === 1) {
    return (parts[0] ?? "").slice(0, 2).toUpperCase();
  }

  return (
    (parts[0]?.charAt(0) ?? "") +
    (parts[1]?.charAt(0) ?? "")
  ).toUpperCase();
};

// Lifecycle
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetGame();
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

/* Difficulty selection */
.shop-difficulty-picker {
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
}

.shop-difficulty-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5vh;
  padding: 1.6vh 1.4vw;
  border: 0.25vh solid #d9c3a1;
  border-radius: 1.4vh;
  background: #fffdf7;
  color: #4a2f1c;
  text-align: left;
  cursor: pointer;
}

.shop-difficulty-option:hover {
  border-color: #8a3177;
  transform: translateY(-0.1vh);
}

.shop-difficulty-title {
  font-size: 2.3vh;
  font-weight: 900;
}

.shop-difficulty-description {
  font-size: 1.8vh;
}

.shop-difficulty-budget {
  font-size: 1.9vh;
  font-weight: 900;
}

.shop-difficulty-timer {
  font-size: 1.7vh;
  font-weight: 700;
  color: #8a3177;
}

.shop-game-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
}

.shop-current-difficulty {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  color: #4a2f1c;
  font-size: 1.8vh;
}

.shop-change-difficulty {
  border: 0.2vh solid #caa677;
  border-radius: 0.8vh;
  padding: 0.7vh 1vw;
  background: #fffdf7;
  color: #6b4a30;
  font-weight: 800;
  cursor: pointer;
}

/* Timer */
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

/* Main layout */
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

/* Cart */
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

/* Transitions */
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
