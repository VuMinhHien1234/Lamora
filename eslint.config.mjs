import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Quy tắc kiến trúc và code sạch của dự án: docs/01-TECH-STANDARDS.md mục 3, 6, 9.
 *
 * Lưu ý cách ESLint hoạt động: với cùng một file, quy tắc `no-restricted-imports`
 * của khối khai báo SAU CÙNG sẽ thay thế hoàn toàn các khối trước.
 * Vì vậy mỗi khối bên dưới đều liệt kê ĐẦY ĐỦ các hạn chế áp dụng cho nhóm file đó.
 */

const root = path.dirname(fileURLToPath(import.meta.url));

// Danh sách feature đọc tự động từ src/features: thêm feature mới không cần sửa file này.
const featuresDir = path.join(root, "src/features");
const features = fs.existsSync(featuresDir)
  ? fs
      .readdirSync(featuresDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];

// ---------- Các nhóm hạn chế import ----------
const ALIAS_ONLY = {
  group: ["../../*"],
  message: "Dùng alias @/ thay cho ../../ (docs/01 mục 6).",
};
const NO_PRISMA = {
  group: ["@prisma/client", "@prisma/client/*", "@/lib/db", "@/generated/**"],
  message: "Chỉ repository.ts được gọi Prisma (docs/01 mục 3).",
};
const NO_REPOSITORY = {
  group: ["**/repository"],
  message: "Không import repository.ts ở đây. Gọi qua service.ts (docs/01 mục 3).",
};
const NO_SERVICE = {
  group: ["**/service"],
  message:
    "Component không import service.ts. Server Component dùng queries.ts, form dùng actions.ts (docs/01 mục 3).",
};
const NO_FRAMEWORK = {
  group: ["next", "next/*", "react", "react/*", "react-dom", "react-dom/*"],
  message: "service.ts là logic thuần, không biết gì về Next.js hay React (docs/01 mục 3).",
};
const NO_DEEP_FEATURE = {
  group: ["@/features/*/*"],
  message:
    "Chỉ import feature qua API công khai: from '@/features/<tên>' (index.ts). Không import sâu (docs/01 mục 3).",
};
const NO_ANY_FEATURE = {
  group: ["@/features/**"],
  message: "Lớp này không được import feature (docs/01 mục 3).",
};
const NO_APP = {
  group: ["@/app/**"],
  message: "Không import từ src/app (docs/01 mục 3).",
};
const NO_COMPONENTS = {
  group: ["@/components/**"],
  message: "Lớp hạ tầng không import component giao diện (docs/01 mục 3).",
};

/** Hạn chế import sâu vào các feature KHÁC feature hiện tại. */
const noOtherFeatureDeep = (current) => ({
  group: features.filter((name) => name !== current).map((name) => `@/features/${name}/*`),
  message: "Feature khác chỉ được dùng qua index.ts: from '@/features/<tên>' (docs/01 mục 3).",
});

const restrict = (...groups) => ({
  "no-restricted-imports": [
    "error",
    { patterns: [ALIAS_ONLY, ...groups.filter((g) => g.group.length > 0)] },
  ],
});

// ---------- Khối theo từng lớp ----------
const layerRules = [
  // Mặc định cho mọi file trong src
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: restrict(NO_DEEP_FEATURE),
  },
  // app/: chỉ định tuyến, không đụng Prisma, chỉ dùng feature qua index.ts
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: restrict(NO_DEEP_FEATURE, NO_PRISMA),
  },
  // components dùng chung
  {
    files: ["src/components/layout/**/*.{ts,tsx}"],
    rules: restrict(NO_DEEP_FEATURE, NO_PRISMA),
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: restrict(NO_ANY_FEATURE, NO_APP, NO_PRISMA),
  },
  // lib/ và config/: hạ tầng, không phụ thuộc ngược lên trên
  {
    files: ["src/lib/**/*.{ts,tsx}", "src/config/**/*.{ts,tsx}"],
    rules: restrict(NO_ANY_FEATURE, NO_APP, NO_COMPONENTS),
  },
];

// Mỗi feature: các nhóm file bên trong có hạn chế riêng
for (const name of features) {
  const base = `src/features/${name}`;
  const cross = noOtherFeatureDeep(name);
  layerRules.push(
    { files: [`${base}/**/*.{ts,tsx}`], rules: restrict(cross) },
    {
      files: [`${base}/components/**/*.{ts,tsx}`],
      rules: restrict(cross, NO_PRISMA, NO_REPOSITORY, NO_SERVICE),
    },
    {
      files: [`${base}/actions.ts`, `${base}/queries.ts`],
      rules: restrict(cross, NO_PRISMA, NO_REPOSITORY),
    },
    {
      files: [`${base}/service.ts`],
      rules: restrict(cross, NO_PRISMA, NO_FRAMEWORK),
    },
    // repository.ts chỉ được dùng lib/db và kiểu Prisma; import file cùng feature bằng đường dẫn tương đối
    { files: [`${base}/repository.ts`], rules: restrict(NO_ANY_FEATURE) },
  );
}

const config = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    ".netlify/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),

  // ---------- TypeScript và code sạch (docs/01 mục 6, 9) ----------
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          minimumDescriptionLength: 10,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    rules: {
      "no-console": "error",
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  // logger là nơi duy nhất được dùng console; seed là script chạy tay
  {
    files: ["src/lib/logger.ts", "prisma/seed.ts"],
    rules: { "no-console": "off" },
  },
  // Hàm export của lớp logic phải khai báo kiểu trả về (component .tsx không bắt buộc)
  {
    files: [
      "src/lib/**/*.ts",
      "src/features/*/service.ts",
      "src/features/*/repository.ts",
      "src/features/*/queries.ts",
      "src/features/*/actions.ts",
    ],
    ignores: ["**/*.test.ts"],
    rules: { "@typescript-eslint/explicit-module-boundary-types": "error" },
  },

  // ---------- Giới hạn kích thước (docs/01 mục 9.1) ----------
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}"],
    rules: {
      "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": [
        "error",
        { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      "max-params": ["error", 3],
      "max-depth": ["error", 3],
    },
  },

  // ---------- Kiến trúc: hướng phụ thuộc giữa các lớp (docs/01 mục 3) ----------
  ...layerRules,
]);

export default config;
