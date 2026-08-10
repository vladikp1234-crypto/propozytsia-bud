// Каталог меблів і техніки — окремий чанк.
// Вантажиться лише коли користувач вмикає блок «Меблі, техніка й декор».

const spalen = (p) => Math.max((p.rooms || 2) - 1, 1);

export const FURNITURE = [
  // Кухня
  { id: "kitchen_set", group: "Кухня", name: "Кухонний гарнітур зі стільницею", unit: "пог.м", qty: () => 3, t: [8000, 15000, 32000], ph: "🍳", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("кухонний гарнітур") },
  { id: "sink_mixer", group: "Кухня", name: "Мийка + змішувач", unit: "компл.", qty: () => 1, t: [3500, 7500, 18000], ph: "🚰", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("кухонна мийка") },
  { id: "hood", group: "Кухня", name: "Витяжка", unit: "шт", qty: () => 1, t: [3000, 7000, 16000], ph: "🌀", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("витяжка кухонна") },
  { id: "hob_oven", group: "Кухня", name: "Варильна поверхня + духовка", unit: "компл.", qty: () => 1, t: [10000, 20000, 45000], ph: "🔥", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("варильна поверхня духова шафа") },
  { id: "fridge", group: "Кухня", name: "Холодильник", unit: "шт", qty: () => 1, t: [14000, 28000, 65000], ph: "🧊", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("холодильник") },
  { id: "dishwasher", group: "Кухня", name: "Посудомийна машина", unit: "шт", qty: () => 1, t: [11000, 18000, 35000], ph: "🍽️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("посудомийна машина 45") },
  { id: "microwave", group: "Кухня", name: "Мікрохвильовка + чайник + дрібна техніка", unit: "компл.", qty: () => 1, t: [3500, 7000, 15000], ph: "☕", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("мікрохвильова піч") },
  { id: "dining", group: "Кухня", name: "Стіл + стільці", unit: "компл.", qty: () => 1, t: [6000, 14000, 38000], ph: "🪑", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("обідній стіл стільці") },
  // Спальня
  { id: "bed", group: "Спальня", name: "Ліжко", unit: "шт", qty: spalen, t: [7000, 16000, 40000], ph: "🛏️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("ліжко двоспальне") },
  { id: "mattress", group: "Спальня", name: "Матрац", unit: "шт", qty: spalen, t: [5000, 12000, 30000], ph: "💤", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("матрац ортопедичний") },
  { id: "wardrobe", group: "Спальня", name: "Шафа / гардероб", unit: "шт", qty: spalen, t: [8000, 18000, 45000], ph: "🚪", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("шафа купе") },
  { id: "nightstands", group: "Спальня", name: "Тумби приліжкові (пара)", unit: "компл.", qty: spalen, t: [2500, 5500, 14000], ph: "🕯️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("тумба приліжкова") },
  { id: "dresser", group: "Спальня", name: "Комод + дзеркало", unit: "компл.", qty: () => 1, t: [4500, 9500, 24000], ph: "🪞", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("комод спальня") },
  // Вітальня
  { id: "sofa", group: "Вітальня", name: "Диван", unit: "шт", qty: () => 1, t: [12000, 26000, 70000], ph: "🛋️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("диван кутовий") },
  { id: "armchair", group: "Вітальня", name: "Крісло", unit: "шт", qty: () => 1, t: [4000, 9000, 25000], ph: "💺", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("крісло мʼяке") },
  { id: "coffee_table", group: "Вітальня", name: "Журнальний стіл", unit: "шт", qty: () => 1, t: [2000, 5000, 14000], ph: "🫖", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("журнальний столик") },
  { id: "tv_unit", group: "Вітальня", name: "TV-тумба / стінка", unit: "шт", qty: () => 1, t: [4000, 9500, 26000], ph: "📺", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("тумба під телевізор") },
  { id: "tv", group: "Вітальня", name: "Телевізор", unit: "шт", qty: () => 1, t: [12000, 25000, 60000], ph: "🖥️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("телевізор 55") },
  { id: "shelving", group: "Вітальня", name: "Стелаж / полиці", unit: "шт", qty: () => 1, t: [2500, 6000, 16000], ph: "📚", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("стелаж") },
  { id: "rug", group: "Вітальня", name: "Килим", unit: "шт", qty: () => 1, t: [2500, 6500, 20000], ph: "🧶", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("килим 200х300") },
  // Санвузол
  { id: "washer", group: "Санвузол", name: "Пральна машина", unit: "шт", qty: () => 1, t: [11000, 19000, 38000], ph: "🌊", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("пральна машина") },
  { id: "dryer", group: "Санвузол", name: "Сушильна машина", unit: "шт", qty: () => 0, t: [15000, 24000, 42000], ph: "🌪️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("сушильна машина") },
  { id: "bath_mirror", group: "Санвузол", name: "Дзеркало-шафа з підсвіткою", unit: "шт", qty: (p) => p.bathrooms, t: [2500, 6000, 15000], ph: "🪞", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("дзеркало ванна підсвітка") },
  { id: "bath_acc", group: "Санвузол", name: "Аксесуари (тримачі, гачки, кошик)", unit: "компл.", qty: (p) => p.bathrooms, t: [1200, 3000, 8000], ph: "🧴", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("аксесуари для ванної") },
  // Передпокій
  { id: "hall_wardrobe", group: "Передпокій", name: "Шафа / вішалка", unit: "шт", qty: () => 1, t: [5000, 11000, 28000], ph: "🧥", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("шафа передпокій") },
  { id: "shoe_rack", group: "Передпокій", name: "Взуттєвниця + пуф", unit: "компл.", qty: () => 1, t: [1800, 4000, 10000], ph: "👟", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("взуттєвниця") },
  { id: "hall_mirror", group: "Передпокій", name: "Дзеркало", unit: "шт", qty: () => 1, t: [1200, 3000, 9000], ph: "🪞", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("дзеркало настінне") },
  // Кабінет
  { id: "desk", group: "Кабінет", name: "Стіл письмовий", unit: "шт", qty: () => 0, t: [3000, 7000, 18000], ph: "🖊️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("стіл письмовий") },
  { id: "office_chair", group: "Кабінет", name: "Крісло робоче", unit: "шт", qty: () => 0, t: [2500, 6500, 18000], ph: "🪑", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("крісло офісне") },
  // Освітлення
  { id: "chandeliers", group: "Освітлення", name: "Люстри / стельові світильники", unit: "шт", qty: (p) => (p.rooms || 2) + 1, t: [1500, 4000, 12000], ph: "💡", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("люстра стельова") },
  { id: "lamps", group: "Освітлення", name: "Бра / торшери / настільні", unit: "шт", qty: (p) => p.rooms || 2, t: [800, 2200, 7000], ph: "🕯️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("бра настінне") },
  { id: "led", group: "Освітлення", name: "LED-підсвітка (ніші, кухня)", unit: "компл.", qty: () => 1, t: [1500, 3500, 9000], ph: "✨", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("led стрічка комплект") },
  // Текстиль і декор
  { id: "curtains", group: "Текстиль і декор", name: "Штори + карнизи + тюль", unit: "вікно", qty: (p) => p.windowsCount || (p.rooms || 2) + 1, t: [2000, 4500, 12000], ph: "🪟", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("штори блекаут") },
  { id: "bedding", group: "Текстиль і декор", name: "Постільні комплекти + ковдри", unit: "спальня", qty: spalen, t: [1500, 3500, 9000], ph: "🛌", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("постільна білизна комплект") },
  { id: "decor_set", group: "Текстиль і декор", name: "Декор: подушки, пледи, вази, картини", unit: "компл.", qty: () => 1, t: [3000, 7000, 20000], ph: "🖼️", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("декор для дому") },
  { id: "plants", group: "Текстиль і декор", name: "Рослини + кашпо", unit: "компл.", qty: () => 1, t: [1000, 2500, 7000], ph: "🪴", url: "https://epicentrk.ua/ua/search/?q=" + encodeURIComponent("вазон кашпо") },
];


export const FURN_GROUPS = ["Кухня", "Спальня", "Вітальня", "Санвузол", "Передпокій", "Кабінет", "Освітлення", "Текстиль і декор"];
