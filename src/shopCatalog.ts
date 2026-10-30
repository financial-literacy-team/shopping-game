export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

const shopCatalog: ShopItem[] = [
  {
    id: "bread",
    name: "Хліб",
    price: 35,
    category: "base",
    description: "Свіжий батон на щодень.",
    image: "/src/assets/bread.png",
  },
  {
    id: "milk",
    name: "Молоко",
    price: 52,
    category: "dairy",
    description: "1 л, 2.5% жирності.",
    image: "/src/assets/milk.png",
  },
  {
    id: "eggs",
    name: "Яйця",
    price: 78,
    category: "base",
    description: "Десяток яєць.",
    image: "/src/assets/eggs.png",
  },
  {
    id: "cheese",
    name: "Сир",
    price: 120,
    category: "dairy",
    description: "Твердий сир 200 г.",
    image: "/src/assets/cheese.png",
  },
  {
    id: "chicken",
    name: "Куряче філе",
    price: 165,
    category: "meat",
    description: "Філе 500 г.",
    image: "/src/assets/chicken.png",
  },
  {
    id: "pasta",
    name: "Паста",
    price: 48,
    category: "base",
    description: "Спагеті 400 г.",
    image: "/src/assets/pasta.png",
  },
  {
    id: "vegetables",
    name: "Овочі",
    price: 90,
    category: "produce",
    description: "Мікс сезонних овочів.",
    image: "/src/assets/vegetables.png",
  },
  {
    id: "fruit",
    name: "Фрукти",
    price: 110,
    category: "produce",
    description: "Кілограм яблук.",
    image: "/src/assets/fruits.png",
  },
  {
    id: "oil",
    name: "Олія",
    price: 75,
    category: "base",
    description: "Соняшникова олія 0.9 л.",
    image: "/src/assets/oil.png",
  },
  {
    id: "juice",
    name: "Сік",
    price: 65,
    category: "drinks",
    description: "Пакет 1 л.",
    image: "/src/assets/juice.png",
  },
];

export default shopCatalog;
