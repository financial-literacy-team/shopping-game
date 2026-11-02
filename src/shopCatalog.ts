// Imported (not "/src/assets/..." paths) so the images resolve inside the host game too
import breadImg from "./assets/bread.webp";
import cheeseImg from "./assets/cheese.webp";
import chickenImg from "./assets/chicken.webp";
import eggsImg from "./assets/eggs.webp";
import fruitsImg from "./assets/fruits.webp";
import juiceImg from "./assets/juice.webp";
import milkImg from "./assets/milk.webp";
import oilImg from "./assets/oil.webp";
import pastaImg from "./assets/pasta.webp";
import vegetablesImg from "./assets/vegetables.webp";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

export const shopCatalog: ShopItem[] = [
  {
    id: "bread",
    name: "Хліб",
    price: 35,
    category: "base",
    description: "Свіжий батон на щодень.",
    image: breadImg,
  },
  {
    id: "milk",
    name: "Молоко",
    price: 52,
    category: "dairy",
    description: "1 л, 2.5% жирності.",
    image: milkImg,
  },
  {
    id: "eggs",
    name: "Яйця",
    price: 78,
    category: "base",
    description: "Десяток яєць.",
    image: eggsImg,
  },
  {
    id: "cheese",
    name: "Сир",
    price: 120,
    category: "dairy",
    description: "Твердий сир 200 г.",
    image: cheeseImg,
  },
  {
    id: "chicken",
    name: "Куряче філе",
    price: 165,
    category: "meat",
    description: "Філе 500 г.",
    image: chickenImg,
  },
  {
    id: "pasta",
    name: "Паста",
    price: 48,
    category: "base",
    description: "Спагеті 400 г.",
    image: pastaImg,
  },
  {
    id: "vegetables",
    name: "Овочі",
    price: 90,
    category: "produce",
    description: "Мікс сезонних овочів.",
    image: vegetablesImg,
  },
  {
    id: "fruit",
    name: "Фрукти",
    price: 110,
    category: "produce",
    description: "Кілограм яблук.",
    image: fruitsImg,
  },
  {
    id: "oil",
    name: "Олія",
    price: 75,
    category: "base",
    description: "Соняшникова олія 0.9 л.",
    image: oilImg,
  },
  {
    id: "juice",
    name: "Сік",
    price: 65,
    category: "drinks",
    description: "Пакет 1 л.",
    image: juiceImg,
  },
];

export default shopCatalog;
