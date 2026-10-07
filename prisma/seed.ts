import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { slugify, toSearchText } from "../src/lib/slug";
import { CATEGORIES, COLLECTIONS, PRODUCTS, type SeedProduct } from "./seed-data";

// Cách dùng:
//   pnpm db:seed              → admin + dữ liệu mẫu (CHỈ local/preview)
//   pnpm db:seed:admin        → chỉ tạo tài khoản admin (dùng được ở production)

const adminOnly = process.argv.includes("--admin-only");

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Thiếu biến môi trường ${name} trong file .env`);
  return value;
}

const connectionString = process.env.DIRECT_URL?.trim() || requireEnv("DATABASE_URL");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function seedAdmin(): Promise<void> {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_INITIAL_PASSWORD");
  if (password.length < 10) throw new Error("ADMIN_INITIAL_PASSWORD cần ít nhất 10 ký tự");

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} đã có, giữ nguyên (không đổi mật khẩu).`);
    return;
  }
  const userId = randomUUID();
  await db.user.create({
    data: {
      id: userId,
      email,
      name: "Chủ shop Lamora",
      emailVerified: true,
      role: "ADMIN",
      mustChangePassword: true,
      accounts: {
        create: {
          id: randomUUID(),
          accountId: userId,
          providerId: "credential",
          password: await hashPassword(password),
        },
      },
    },
  });
  console.log(`Đã tạo admin ${email}. Đăng nhập rồi đổi mật khẩu ngay.`);
}

async function seedCategoriesAndCollections(): Promise<void> {
  for (const [index, category] of CATEGORIES.entries()) {
    const data = { name: category.name, description: category.description, sortOrder: index };
    await db.category.upsert({
      where: { slug: category.slug },
      create: { slug: category.slug, ...data },
      update: data,
    });
  }
  for (const [index, collection] of COLLECTIONS.entries()) {
    const data = { name: collection.name, showOnHome: collection.showOnHome, sortOrder: index };
    await db.collection.upsert({
      where: { slug: collection.slug },
      create: { slug: collection.slug, ...data },
      update: data,
    });
  }
}

function variantSku(product: SeedProduct, color: string, size: string): string {
  const parts = [product.code, color, size]
    .map((part) => slugify(part).toUpperCase())
    .filter(Boolean);
  return `LMR-${parts.join("-")}`;
}

async function seedProduct(product: SeedProduct, categoryIds: Map<string, string>): Promise<void> {
  const slug = slugify(product.name);
  if (await db.product.findUnique({ where: { slug }, select: { id: true } })) return;

  const categoryId = categoryIds.get(product.category);
  if (!categoryId) throw new Error(`Không thấy danh mục ${product.category}`);
  const colors = product.variants.map((variant) => variant.color);
  const created = await db.product.create({
    data: {
      name: product.name,
      slug,
      categoryId,
      shortDescription: product.short,
      material: product.material,
      status: "ACTIVE",
      isFeatured: product.featured ?? false,
      publishedAt: new Date(),
      priceFrom: Math.min(...product.variants.map((variant) => variant.price)),
      searchText: toSearchText(
        product.name,
        CATEGORIES.find((c) => c.slug === product.category)?.name,
        ...colors,
      ),
      variants: {
        create: product.variants.map((variant, index) => ({
          sku: variantSku(product, variant.color, variant.size),
          colorName: variant.color,
          colorHex: variant.hex,
          size: variant.size,
          price: variant.price,
          compareAtPrice: variant.compareAt ?? null,
          stockQuantity: variant.stock,
          sortOrder: index,
        })),
      },
      images: {
        create: Array.from({ length: product.images }, (_, index) => ({
          publicId: `lamora/samples/${slug}-${index + 1}`,
          alt: `${product.name} - ảnh ${index + 1}`,
          width: 1200,
          height: 1500,
          sortOrder: index,
        })),
      },
    },
  });
  for (const collectionSlug of product.collections) {
    const collection = await db.collection.findUniqueOrThrow({ where: { slug: collectionSlug } });
    await db.productCollection.create({
      data: { productId: created.id, collectionId: collection.id },
    });
  }
}

async function seedProducts(): Promise<void> {
  const categories = await db.category.findMany({ select: { id: true, slug: true } });
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));
  for (const product of PRODUCTS) await seedProduct(product, categoryIds);
}

type SeedOrder = {
  code: string;
  status: "PENDING" | "SHIPPING" | "CANCELLED";
  payment: "COD" | "BANK_TRANSFER";
  paid: boolean;
  customer: string;
  phone: string;
  sku: string;
  quantity: number;
  shippingFee: number;
  daysAgo: number;
};

const ORDERS: SeedOrder[] = [
  {
    code: "LMR-261001-A2KP",
    status: "PENDING",
    payment: "COD",
    paid: false,
    customer: "Nguyễn Thu Hà",
    phone: "0900000001",
    sku: "LMR-BH001-HONG-PHAN-VUA-45CM",
    quantity: 1,
    shippingFee: 25000,
    daysAgo: 1,
  },
  {
    code: "LMR-260928-7MXQ",
    status: "SHIPPING",
    payment: "BANK_TRANSFER",
    paid: true,
    customer: "Trần Minh Anh",
    phone: "0900000002",
    sku: "LMR-GL001-HONG-VANG-LON-70CM",
    quantity: 1,
    shippingFee: 0,
    daysAgo: 7,
  },
  {
    code: "LMR-260920-HT4E",
    status: "CANCELLED",
    payment: "COD",
    paid: false,
    customer: "Lê Quỳnh Chi",
    phone: "0900000003",
    sku: "LMR-CL002-TRANG",
    quantity: 3,
    shippingFee: 35000,
    daysAgo: 15,
  },
];

async function seedOrder(order: SeedOrder): Promise<void> {
  if (await db.order.findUnique({ where: { code: order.code }, select: { id: true } })) return;
  const variant = await db.productVariant.findUniqueOrThrow({
    where: { sku: order.sku },
    include: { product: true },
  });
  const createdAt = new Date(Date.now() - order.daysAgo * 24 * 60 * 60 * 1000);
  const subtotal = variant.price * order.quantity;
  const label = [variant.colorName, variant.size].filter(Boolean).join(" / ");
  await db.order.create({
    data: {
      code: order.code,
      status: order.status,
      paymentMethod: order.payment,
      paymentStatus: order.paid ? "PAID" : "UNPAID",
      customerName: order.customer,
      customerPhone: order.phone,
      recipientName: order.customer,
      recipientPhone: order.phone,
      provinceCode: "01",
      provinceName: "Hà Nội",
      wardCode: "00001",
      wardName: "Phường mẫu",
      addressLine: "Số 1, ngõ mẫu (địa chỉ giả cho dữ liệu thử)",
      shippingZone: "HANOI_INNER",
      subtotal,
      shippingFee: order.shippingFee,
      total: subtotal + order.shippingFee,
      createdAt,
      cancelReason: order.status === "CANCELLED" ? "Khách đổi ý" : null,
      items: {
        create: {
          productId: variant.productId,
          variantId: variant.id,
          productName: variant.product.name,
          variantLabel: label || null,
          sku: variant.sku,
          unitPrice: variant.price,
          quantity: order.quantity,
          lineTotal: subtotal,
        },
      },
      statusHistory: {
        create: [
          { toStatus: "PENDING", createdAt },
          ...(order.status === "PENDING"
            ? []
            : [{ fromStatus: "PENDING" as const, toStatus: order.status, createdAt }]),
        ],
      },
    },
  });
}

async function main(): Promise<void> {
  await seedAdmin();
  if (adminOnly) return;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Không nạp dữ liệu mẫu ở production. Dùng: pnpm db:seed:admin");
  }
  await seedCategoriesAndCollections();
  await seedProducts();
  for (const order of ORDERS) await seedOrder(order);
  console.log("Đã nạp dữ liệu mẫu: 5 danh mục, 4 bộ sưu tập, 12 sản phẩm, 3 đơn.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
