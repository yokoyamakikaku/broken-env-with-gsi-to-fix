# GSIに関するエラーの再現

Amplifyでのデプロイ時にGSIに関するエラーが発生し、再デプロイを試みても成功しない状態になった。再度正常にデプロイできるようになることはなく、環境を作り直す必要が出た。

関連するイシューもいくつかあったが解決策が明示されていなかった。そのため、環境を再現する手順をまとめ原因の調査に利用する。

## エラーメッセージ

以下のようなエラーメッセージが出てから再デプロイできなくなった。

```
"Cannot update GSI's properties other than Provisioned Throughput and Contributor Insights Specification. You can create a new GSI with a different name."
```

## 関連するイシュー


- [Error: Cannot update GSI's properties other than Provisioned Throughput and Contributor Insights Specification. You can create a new GSI with a different name.](https://github.com/aws-amplify/amplify-category-api/issues/774)
- [Amplify push got error "Message: Resource is not in the state stackUpdateComplete"](https://github.com/aws-amplify/amplify-category-api/issues/92)


# 環境の再現

エラーの発生には複数条件があるが主要な部分は以下の通りある。

- 十分に多いテーブルとインデックス
- コンソールとローカルからの２回のデプロイ

テーブルとインデックスの数がある一定数を超えるとデプロイの時間が30分以上かかることがある。30分はAmplifyの初期設定でのデプロイのタイムアウトの時間である。
コンソールからのデプロイがタイムアウトした状態でローカルからデプロイを行おうとするとデプロイ中であると判断されデプロイに失敗する。
その後にコンソールから再デプロイを行おうとするとGSIに関するエラーが発生する。

## 開発環境

```
% node -v
v18.16.0
% npm -v
9.5.1
```

## 依存パッケージのインストール

```
% npm i
```

## Amplify プロジェクトの作成

既存の Amplify に関するディレクトリを削除し、新たなプロジェクトを作成する。
認証とAPIを追加する。認証は GraphQL を使う。

```
% rm -rf amplify
% amplify init
% amplify add auth
% amplify push -y
% amplify add api
% amplify push -y
```

## リポジトリの接続

GitHub などのリポジトリホスティングサービスにリポジトリをアップロードして連携する。
リポジトリを接続して設定し、対象のブランチに変更があった時にデプロイするようにする。
ブランチの接続に関しては公式ドキュメントを参照されたい。

## スキーマの設定

`/schemas/schema.0.graphql` を `/amplify/backend/api/[appName]/schema.graphql` にコピーしデプロイする。

##　データの作成

以下のような対話に返答しながらデータを作成する

```
% node scripts/create-data/index.mjs
? AWS Profile を選択してください ******
? リージョンを入力してください ap-northeast-1
? UserPool を選択してください ******
? User を選択してください ******(******) (******)
? APIを選択してください ******
? 作成するグループの数を入力してください 20
? 作成するユーザの数を入力してください 200
? 作成する本のカテゴリの数を入力してください 400
? 作成する本の数を入力してください 2000
? 作成する本のコメントの数を入力してください 10000
? 作成するメッセージの数を入力してください 1000
? 作成する予定の数を入力してください 1000
? 作成する記事分類の数を入力してください 20
? 作成する記事の数を入力してください 1000
? 作成する作業の数を入力してください 1000
```

##　スキーマの変更

`/schemas/schema.2.graphql` を `/amplify/backend/api/[appName]/schema.graphql` にコピーしデプロイする。

この時にタイムアウトが発生する。

以下のようなログが出ることがある。

```
                                 # Starting phase: build
2023-06-27T11:20:43.907Z [INFO]: [0mAmplify AppID found: d2y19gw9w63o6p. Amplify App name is: brokenenvwithgsi[0m
2023-06-27T11:20:43.964Z [INFO]: [0mBackend environment main found in Amplify Console app: brokenenvwithgsi[0m
2023-06-27T11:20:44.818Z [WARNING]: - Fetching updates to backend environment: main from the cloud.
2023-06-27T11:20:45.583Z [WARNING]: - Building resource api/brokenenvwithgsi
2023-06-27T11:20:47.616Z [INFO]: ⚠️ WARNING: owners may reassign ownership for the following model(s) and role(s): Group: [owner], User: [owner], BookCategory: [owner], Book: [owner], Comment: [owner], Message: [owner], Schedule: [owner], PostCategory: [owner], Post: [owner], Todo: [owner]. If this is not intentional, you may want to apply field-level authorization rules to these fields. To read more: https://docs.amplify.aws/cli/graphql/authorization-rules/#per-user--owner-based-data-access.
2023-06-27T11:20:47.883Z [INFO]: ✅ GraphQL schema compiled successfully.
                                 Edit your schema at /codebuild/output/src369714442/src/broken-env-with-gsi/amplify/backend/api/brokenenvwithgsi/schema.graphql or place .graphql files in a directory at /codebuild/output/src369714442/src/broken-env-with-gsi/amplify/backend/api/brokenenvwithgsi/schema
2023-06-27T11:20:47.884Z [WARNING]: - Building resource auth/brokenenvwithgsibc0e92fd
2023-06-27T11:20:47.927Z [WARNING]: ✔ Successfully pulled backend environment main from the cloud.
2023-06-27T11:20:47.965Z [INFO]: ✅
2023-06-27T11:20:51.148Z [INFO]: [33mNote: It is recommended to run this command from the root of your app directory[39m
2023-06-27T11:20:51.303Z [WARNING]: - Initializing your environment: main
2023-06-27T11:20:52.170Z [WARNING]: - Building resource api/brokenenvwithgsi
2023-06-27T11:20:53.968Z [INFO]: ⚠️ WARNING: owners may reassign ownership for the following model(s) and role(s): Group: [owner], User: [owner], BookCategory: [owner], Book: [owner], Comment: [owner], Message: [owner], Schedule: [owner], PostCategory: [owner], Post: [owner], Todo: [owner]. If this is not intentional, you may want to apply field-level authorization rules to these fields. To read more: https://docs.amplify.aws/cli/graphql/authorization-rules/#per-user--owner-based-data-access.
2023-06-27T11:20:54.270Z [INFO]: ✅ GraphQL schema compiled successfully.
                                 Edit your schema at /codebuild/output/src369714442/src/broken-env-with-gsi/amplify/backend/api/brokenenvwithgsi/schema.graphql or place .graphql files in a directory at /codebuild/output/src369714442/src/broken-env-with-gsi/amplify/backend/api/brokenenvwithgsi/schema
2023-06-27T11:20:54.271Z [WARNING]: - Building resource auth/brokenenvwithgsibc0e92fd
2023-06-27T11:20:54.313Z [WARNING]: ✔ Initialized provider successfully.
2023-06-27T11:20:54.681Z [WARNING]: ✖ There was an error initializing your environment.
2023-06-27T11:20:54.682Z [INFO]: 🛑 Cannot iteratively rollback as the following step does not contain a previousMetaKey: {"status":"DEPLOYING"}
                                 Learn more at: https://docs.amplify.aws/cli/project/troubleshooting/
2023-06-27T11:20:54.699Z [INFO]:
2023-06-27T11:20:54.699Z [INFO]: Session Identifier: e5781fc3-6e96-4387-bc8f-188dcaed85ce
2023-06-27T11:20:54.699Z [WARNING]: - Creating Zip
2023-06-27T11:20:54.715Z [INFO]: ✅ Report saved: /tmp/brokenenvwithgsi/report-1687864854702.zip
2023-06-27T11:20:54.716Z [INFO]:
2023-06-27T11:20:54.716Z [WARNING]: - Sending zip
2023-06-27T11:20:56.310Z [WARNING]: ✔ Done
2023-06-27T11:20:56.310Z [INFO]: Project Identifier: 5dba35224393ff9d7764fe2755d3c8e8
2023-06-27T11:20:56.332Z [ERROR]: !!! Build failed
2023-06-27T11:20:56.332Z [INFO]: Please check the supported SSR features to find if your build failure is related to an unsupported feature: https://docs.aws.amazon.com/amplify/latest/userguide/ssr-Amplify-support.html#supported-unsupported-features. You may also find this troubleshooting guide useful: https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-ssr-deployment.html
2023-06-27T11:20:56.332Z [ERROR]: !!! Non-Zero Exit Code detected
2023-06-27T11:20:56.333Z [INFO]: # Starting environment caching...
2023-06-27T11:20:56.333Z [INFO]: # Uploading environment cache artifact...
2023-06-27T11:20:56.456Z [INFO]: # Uploaded environment cache artifact
2023-06-27T11:20:56.456Z [INFO]: # Environment caching completed
Terminating logging...
```

##　ローカルからのデプロイ

同じ状態でローカルからデプロイする。ここでも失敗する

```
% amplify push -y
```

##　再度コンソールからデプロイをする

コンソール画面から「このバージョンを再デプロイ」を行う。

そこで以下のようなエラーが出る。

```
2023-06-27T11:38:04.383Z [INFO]: 🛑 The following resources failed to deploy:
                                 Resource Name: BookTable (AWS::DynamoDB::Table)
                                 Event Type: update
                                 Reason: Resource handler returned message: "Cannot perform more than one GSI creation or deletion in a single update" (RequestToken: 2f71b790-fda0-83a5-752a-35db9c619660, HandlerErrorCode: InvalidRequest)
                                 URL: https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/arn%3Aaws%3Acloudformation%3Aap-northeast-1%3A693825121436%3Astack%2Famplify-brokenenvwithgsi-main-202440-apibrokenenvwithgsi-ZWFILMZMSSBQ-Book-1HT67HFNB7H3T%2F2f723040-1417-11ee-bf01-06a04fef5983/events
                                 Resource Name: ScheduleTable (AWS::DynamoDB::Table)
                                 Event Type: update
                                 Reason: Resource handler returned message: "Cannot perform more than one GSI creation or deletion in a single update" (RequestToken: fcd1554f-cef0-7293-bc21-cf498fe3e255, HandlerErrorCode: InvalidRequest)
                                 URL: https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/arn%3Aaws%3Acloudformation%3Aap-northeast-1%3A693825121436%3Astack%2Famplify-brokenenvwithgsi-main-202440-apibrokenenvwithgsi-ZWFILMZMSSBQ-Schedule-1LFHW0EEQP1PP%2F56df9da0-1487-11ee-b1e1-067eb25769dd/events
2023-06-27T11:38:04.384Z [INFO]: Resource Name: UserTable (AWS::DynamoDB::Table)
```

これエラーを再現できる。

# 注意

エラーの再現に確実性は少ない。

起きにくい場合は各環境でのデプロイの試みを増やすと再現率が高まる。それでもデプロイできない場合はスキーマを変えてデプロイを繰り返すことで再現率が高まる可能性がある。
