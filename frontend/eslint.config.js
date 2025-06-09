import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      "no-debugger": "warn",
      eqeqeq: ["error", "always"],
      "no-alert": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }],

      "prefer-const": "error",
      "no-var": "error",
      "array-callback-return": ["error", { allowImplicit: true }],
      "default-case": "error",
      "guard-for-in": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-loop-func": "error",
      "no-return-await": "error",
      "require-await": "error",
      yoda: ["error", "never"],

      // 风格指南 (根据 Prettier 调整，这里作为 ESLint 的补充)
      indent: ["error", 2, { SwitchCase: 1 }], // 强制 2 个空格缩进，switch case 缩进 1 级
      quotes: [
        "error",
        "single",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      // 强制使用单引号，允许字符串包含引号时使用反引号，允许模板字符串
      semi: ["error", "never"], // 禁止使用分号
      "comma-dangle": ["error", "always-multiline"], // 多行时强制使用尾随逗号
      "key-spacing": ["error", { beforeColon: false, afterColon: true }], // 对象属性的键和值之间的空格
      "space-before-function-paren": [
        "error",
        { anonymous: "always", named: "never", asyncArrow: "always" },
      ],
      // 强制函数括号前的空格（匿名函数和箭头函数强制，命名函数不允许）
      "object-curly-spacing": ["error", "always"], // 强制对象大括号内有空格
      "array-bracket-spacing": ["error", "never"], // 强制数组方括号内没有空格
      "block-spacing": ["error", "always"], // 强制块语句大括号内有空格
      "arrow-spacing": ["error", { before: true, after: true }], // 箭头函数箭头两边强制有空格
      "space-infix-ops": "error", // 强制中缀操作符周围有空格 (如 `a + b`)
      "no-trailing-spaces": "error", // 禁止行尾空格

      "react/jsx-uses-react": "off", // React 17+ 不需要显式导入 React
      "react/react-in-jsx-scope": "off", // React 17+ 不需要显式导入 React
      "react/prop-types": "off", // 如果使用 TypeScript 或明确不需要 prop-types，可以关闭
      "react/jsx-key": "error", // 在迭代器或数组中强制使用 `key` 属性
      "react/self-closing-comp": ["error", { component: true, html: true }],
      // 没有子元素的组件和 HTML 标签强制自闭合
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".jsx", ".js"] },
      ], // 强制 JSX 文件扩展名
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      // 强制 JSX 属性和子元素中不必要的花括号（如 `<div className={"foo"}>`）
      "react/no-array-index-key": "warn", // 警告不要使用数组索引作为 `key`
      "react/button-has-type": [
        "error",
        { reset: true, submit: true, button: true },
      ], // 强制 `<button>` 元素有 `type` 属性
      "react/no-children-prop": "error", // 禁止使用 `children` prop
      "react/jsx-no-target-blank": ["error", { allowReferrer: true }], // 强制 `target="_blank"` 的链接包含 `rel="noreferrer noopener"`
      "react/jsx-no-useless-fragment": "error", // 禁用不必要的 React fragment
    },
  },
];
