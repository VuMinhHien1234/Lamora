// Quy tắc commit: docs/01-TECH-STANDARDS.md mục 12.2
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "test", "chore", "style", "perf"],
    ],
    "header-max-length": [2, "always", 100],
    // Mô tả viết tiếng Việt nên không ép kiểu chữ hoa/thường
    "subject-case": [0],
    // Thân commit tiếng Việt, không giới hạn độ dài dòng
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};

export default config;
