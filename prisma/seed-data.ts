// Dữ liệu mẫu cho local/preview (docs/02 mục 7). Ảnh dùng publicId giả: thay bằng ảnh thật ở trang quản trị.

export const CATEGORIES = [
  {
    slug: "canh-hoa-le",
    name: "Cành hoa lẻ",
    description: "Từng cành hoa lụa tinh tế để bạn tự do phối riêng.",
  },
  {
    slug: "binh-hoa-cam-san",
    name: "Bình hoa cắm sẵn",
    description: "Bình hoa đã cắm hoàn thiện, đặt lên bàn là đẹp.",
  },
  {
    slug: "gio-lang-hoa",
    name: "Giỏ & lẵng hoa",
    description: "Giỏ, lẵng hoa lụa dành cho quà tặng và khai trương.",
  },
  {
    slug: "hoa-trang-tri-treo-tuong",
    name: "Hoa trang trí treo tường",
    description: "Vòng hoa, giỏ treo cho góc tường thêm dịu dàng.",
  },
  { slug: "phu-kien", name: "Phụ kiện", description: "Bình, lọ, ruy băng để hoàn thiện bó hoa." },
] as const;

export const COLLECTIONS = [
  { slug: "sinh-nhat", name: "Sinh nhật", showOnHome: true },
  { slug: "khai-truong", name: "Khai trương", showOnHome: true },
  { slug: "trang-tri-nha", name: "Trang trí nhà", showOnHome: true },
  { slug: "qua-20-10", name: "Quà 20/10", showOnHome: false },
] as const;

export type SeedVariant = {
  color: string;
  hex: string | null;
  size: string;
  price: number;
  compareAt?: number;
  stock: number;
};

export type SeedProduct = {
  code: string;
  name: string;
  category: (typeof CATEGORIES)[number]["slug"];
  short: string;
  material: string;
  featured?: boolean;
  collections: Array<(typeof COLLECTIONS)[number]["slug"]>;
  images: number;
  variants: SeedVariant[];
};

const SILK = "Lụa cao cấp, cành thép bọc nhựa";

export const PRODUCTS: SeedProduct[] = [
  {
    code: "BH001",
    name: "Bình mẫu đơn hồng phấn",
    category: "binh-hoa-cam-san",
    featured: true,
    short: "Những đóa mẫu đơn ửng hồng trong bình gốm trắng.",
    material: SILK,
    collections: ["sinh-nhat", "trang-tri-nha", "qua-20-10"],
    images: 3,
    variants: [
      { color: "Hồng phấn", hex: "#E8B4B8", size: "Nhỏ (30cm)", price: 450000, stock: 12 },
      {
        color: "Hồng phấn",
        hex: "#E8B4B8",
        size: "Vừa (45cm)",
        price: 650000,
        compareAt: 720000,
        stock: 8,
      },
      { color: "Trắng ngà", hex: "#F3EBDD", size: "Vừa (45cm)", price: 650000, stock: 5 },
    ],
  },
  {
    code: "BH002",
    name: "Bình hoa hồng champagne",
    category: "binh-hoa-cam-san",
    featured: true,
    short: "Hoa hồng champagne sang trọng, hợp phòng khách.",
    material: SILK,
    collections: ["trang-tri-nha", "qua-20-10"],
    images: 3,
    variants: [
      { color: "Champagne", hex: "#E7D3B5", size: "Nhỏ (30cm)", price: 520000, stock: 10 },
      { color: "Champagne", hex: "#E7D3B5", size: "Lớn (60cm)", price: 980000, stock: 4 },
    ],
  },
  {
    code: "BH003",
    name: "Bình tulip trắng",
    category: "binh-hoa-cam-san",
    short: "Tulip trắng thanh khiết, tối giản.",
    material: SILK,
    collections: ["trang-tri-nha"],
    images: 2,
    variants: [{ color: "Trắng", hex: "#FFFFFF", size: "", price: 390000, stock: 15 }],
  },
  {
    code: "CL001",
    name: "Cành hồng cổ",
    category: "canh-hoa-le",
    featured: true,
    short: "Một cành hồng cổ nhiều lớp cánh.",
    material: SILK,
    collections: ["sinh-nhat"],
    images: 2,
    variants: [
      { color: "Hồng đào", hex: "#E9A99B", size: "", price: 65000, stock: 60 },
      { color: "Đỏ rượu", hex: "#8E2F3C", size: "", price: 65000, stock: 40 },
      { color: "Trắng kem", hex: "#F5EDE0", size: "", price: 65000, stock: 50 },
      { color: "Vàng bơ", hex: "#EBD9A0", size: "", price: 65000, stock: 0 },
    ],
  },
  {
    code: "CL002",
    name: "Cành lan hồ điệp",
    category: "canh-hoa-le",
    short: "Cành lan hồ điệp bảy bông, dáng cong mềm.",
    material: SILK,
    collections: ["khai-truong", "qua-20-10"],
    images: 3,
    variants: [
      { color: "Trắng", hex: "#FFFFFF", size: "", price: 180000, stock: 20 },
      { color: "Tím nhạt", hex: "#B9A2C8", size: "", price: 180000, stock: 18 },
    ],
  },
  {
    code: "CL003",
    name: "Cành cúc họa mi",
    category: "canh-hoa-le",
    short: "Chùm cúc họa mi nhỏ xinh, dùng làm điểm nhấn.",
    material: SILK,
    collections: ["sinh-nhat", "trang-tri-nha"],
    images: 2,
    variants: [{ color: "Trắng", hex: "#FFFFFF", size: "", price: 45000, stock: 100 }],
  },
  {
    code: "GL001",
    name: "Giỏ hoa chúc mừng khai trương",
    category: "gio-lang-hoa",
    short: "Giỏ hoa rực rỡ cho ngày khai trương.",
    material: SILK,
    collections: ["khai-truong"],
    images: 3,
    variants: [
      { color: "Hồng - Vàng", hex: "#E8B4B8", size: "Vừa (50cm)", price: 850000, stock: 6 },
      { color: "Hồng - Vàng", hex: "#E8B4B8", size: "Lớn (70cm)", price: 1450000, stock: 3 },
    ],
  },
  {
    code: "GL002",
    name: "Lẵng hoa mini sinh nhật",
    category: "gio-lang-hoa",
    featured: true,
    short: "Lẵng nhỏ xinh, quà sinh nhật đáng yêu.",
    material: SILK,
    collections: ["sinh-nhat", "qua-20-10"],
    images: 2,
    variants: [
      { color: "Pastel", hex: "#F2D7D9", size: "Nhỏ (25cm)", price: 320000, stock: 14 },
      { color: "Cam đào", hex: "#F3C1A8", size: "Nhỏ (25cm)", price: 320000, stock: 9 },
    ],
  },
  {
    code: "TT001",
    name: "Vòng hoa treo tường eucalyptus",
    category: "hoa-trang-tri-treo-tuong",
    short: "Vòng lá bạc hà điểm hoa nhỏ, treo cửa hoặc tường.",
    material: SILK,
    collections: ["trang-tri-nha"],
    images: 2,
    variants: [
      { color: "Xanh bạc", hex: "#A9BBA7", size: "Ø30cm", price: 280000, stock: 10 },
      { color: "Xanh bạc", hex: "#A9BBA7", size: "Ø45cm", price: 420000, stock: 7 },
    ],
  },
  {
    code: "TT002",
    name: "Giỏ hoa treo tường dáng thác",
    category: "hoa-trang-tri-treo-tuong",
    short: "Hoa rủ mềm mại, làm đẹp một góc tường trống.",
    material: SILK,
    collections: ["trang-tri-nha", "khai-truong"],
    images: 3,
    variants: [
      {
        color: "Hồng - Xanh",
        hex: "#E8B4B8",
        size: "Dài 60cm",
        price: 540000,
        compareAt: 600000,
        stock: 5,
      },
    ],
  },
  {
    code: "PK001",
    name: "Bình gốm trắng men rạn",
    category: "phu-kien",
    short: "Bình gốm men rạn, cắm vừa một bó nhỏ.",
    material: "Gốm sứ men rạn",
    collections: ["trang-tri-nha"],
    images: 2,
    variants: [
      { color: "Trắng", hex: "#F7F3EC", size: "Cao 18cm", price: 190000, stock: 20 },
      { color: "Trắng", hex: "#F7F3EC", size: "Cao 25cm", price: 260000, stock: 11 },
    ],
  },
  {
    code: "PK002",
    name: "Ruy băng lụa gói hoa",
    category: "phu-kien",
    short: "Cuộn ruy băng lụa bản 2,5cm, dài 10m.",
    material: "Lụa satin",
    collections: [],
    images: 2,
    variants: [
      { color: "Hồng phấn", hex: "#E8B4B8", size: "", price: 55000, stock: 80 },
      { color: "Kem", hex: "#F3EBDD", size: "", price: 55000, stock: 75 },
      { color: "Vàng gold", hex: "#C9A24A", size: "", price: 55000, stock: 60 },
    ],
  },
];
