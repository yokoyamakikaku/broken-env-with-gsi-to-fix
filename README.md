# GSIに関するエラーの再現

Amplify のGSIのエラーを再現するための手順をまとめる

# 環境

```
% node -v
v18.16.0
% npm -v
9.5.1
```

# 依存パッケージのインストール

```
% npm i
```

# Amplify プロジェクトの作成

```
% amplify init
% amplify add auth
% amplify push -y
% amplify add api
% amplify push -y
```

## リポジトリの接続

GitHub などのリポジトリホスティングサービスにリポジトリをアップロードして連携する。
リポジトリを接続して設定し、対象のブランチに変更があった時にデプロイするようにする。

https://docs.aws.amazon.com/ja_jp/amplify/latest/userguide/setting-up-GitHub-access.html


# エラーの発生

1. 初期スキーマの定義
- 初期のデプロイ
- データの登録
- スキーマの更新
- 更新後のデプロイ

## 初期スキーマのデプロイ

`/schemas/schema.0.graphql` を `/amplify/backend/api/brokenenvwithgsi/schema.graphql` に配置しデプロイする。


```
% amplify push -y
```

## データの登録


```
% node ./scripts/create-data/index.mjs
```

## スキーマの更新

`/schemas/schema.1.graphql` を `/amplify/backend/api/brokenenvwithgsi/schema.graphql` に配置する

## 更新後のデプロイ

CI/CDを使ってデプロイするようにする。
そのため変更をプッシュする。

```
% git push -u origin main
```
