// Chạy trên các file đã git add, trước mỗi commit (docs/01 mục 12.3)
const config = {
  "*.{ts,tsx,js,jsx,mjs,cjs}": [
    "eslint --fix --max-warnings 0 --no-warn-ignored",
    "prettier --write",
  ],
  "*.{json,css,yml,yaml}": ["prettier --write"],
};

export default config;
