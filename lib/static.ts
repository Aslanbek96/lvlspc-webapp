export const locations = [
  {
    id: "10",
    name: "Астана",
    nameEng: "astana",
    amount: 95,
    min: 420000,
    target: 450000,
  },
  {
    id: "1",
    name: "Сарайшык",
    nameEng: "saraishyq",
    amount: 65,
    min: 250000,
    target: 300000,
  },
  {
    id: "12",
    name: "Хозяин",
    nameEng: "hozyain",
    amount: 50,
    min: 300000,
    target: 350000,
  },
  {
    id: "11",
    name: "Зачаганск",
    nameEng: "zachagansk",
    amount: 65,
    min: 200000,
    target: 250000,
  },
  {
    id: "13",
    name: "Орал",
    nameEng: "oral",
    amount: 71,
    min: 350000,
    target: 400000,
  },
  {
    id: "100",
    name: "Оффис",
    nameEng: "office",
    amount: 0,
    min: 0,
    target: 0,
  },
  {
    id: "200 ",
    name: "Все",
    nameEng: "all",
    amount: 0,
    min: 1520000,
    target: 1750000,
  },
];

export const roles = [
  {
    name: "Администратор",
    value: "ADMIN",
  },
  {
    name: "Владелец",
    value: "OWNER",
  },
  {
    name: "Директор",
    value: "DIRECTOR",
  },
  {
    name: "Финансист",
    value: "FINANCE",
  },
  {
    name: "ИТ специалист",
    value: "IT",
  },
  {
    name: "Управляющий",
    value: "MANAGER",
  },
  {
    name: "Оператор",
    value: "OPERATOR",
  },
  {
    name: "Кассир",
    value: "CASHIER",
  },
  {
    name: "Тех. персонал",
    value: "CLEANER",
  },
];

export const orderStatus = [
  { status: "INITIALIZED", statusRu: "В ожидании счета", color: "#FFF3C7" },
  { status: "PENDING", statusRu: "Ожидает оплаты", color: "#E4FFE0" },
  { status: "PAID", statusRu: "Ожидает доставки", color: "#FFE0E0" },
  { status: "DELIVERED", statusRu: "Доставлен", color: "#E9E0FF" },
  { status: "CANCELLED", statusRu: "Отменен", color: "#D3D3D3" },
];
