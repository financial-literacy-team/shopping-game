
export type ShopDifficulty = "easy" | "medium" | "hard";

export interface ShopDifficultyOption {
  id: ShopDifficulty;
  title: string;
  description: string;
  budget: number;
  timeLimit: number | null;
}

export const SHOP_CURRENCY = "UAH" as const;

export interface ShopGameResult {
  difficulty: ShopDifficulty;
  spent: number;
  remainingBudget: number;
  currency: typeof SHOP_CURRENCY;
  items: Array<{
    id: string;
    qty: number;
  }>;
  completed: boolean;
}

/**
 * All difficulty levels use the same shared product catalog.
 * Difficulty affects only the budget and timer.
 */
export const shopDifficulties: ShopDifficultyOption[] = [
  {
    id: "easy",
    title: "Легкий",
    description: "Спокійно обирай товари та стеж за бюджетом",
    budget: 500,
    timeLimit: null,
  },
  {
    id: "medium",
    title: "Середній",
    description: "Більший бюджет і ті самі товари — плануй покупки",
    budget: 1200,
    timeLimit: null,
  },
  {
    id: "hard",
    title: "Важкий",
    description: "Встигни зібрати кошик за обмежений час",
    budget: 800,
    timeLimit: 15,
  },
];
