# AKI-ERP-Frontend

此專案使用 `yarn` 作為套件管理工具，打包指令為 `yarn build`。

## 整合 CI/CD

此專案使用 GitHub Actions 進行 CI/CD。

以下是 `.github/workflows/build.yml` 的範例：

```yaml
name: Build

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build
        run: yarn build 

      - name: Archive artifacts
        uses: actions/upload-artifact@v2
        with:
          name: build
          path: dist/
