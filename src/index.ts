
import ShopMiniGame from "./components/Shop.vue";

import shopCatalog from "./shopCatalog";
import type { ShopItem } from "./shopCatalog";

import {
  SHOP_CURRENCY,
  shopDifficulties,
} from "./shopScenarios";

import type {
  ShopDifficulty,
  ShopDifficultyOption,
  ShopGameResult,
} from "./shopScenarios";

export {
  ShopMiniGame,
  shopCatalog,
  SHOP_CURRENCY,
  shopDifficulties,
};

export type {
  ShopItem,
  ShopDifficulty,
  ShopDifficultyOption,
  ShopGameResult,
};

export default ShopMiniGame;
