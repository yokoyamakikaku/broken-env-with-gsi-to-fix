import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { add, format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import Chance from 'chance'

import { fromIni } from  '@aws-sdk/credential-providers'
import { AppSyncClient, GetDataSourceCommand, ListGraphqlApisCommand } from '@aws-sdk/client-appsync'
import { AdminCreateUserCommand, CognitoIdentityProviderClient, ListUserPoolsCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];

async function main () {

  // NOTE: Profile
  const credentialsTxtPath = path.resolve(HOME, '.aws/credentials')
  const credentialsTxt = fs.readFileSync(credentialsTxtPath, { encoding: 'utf-8' })

  /** @type {{ name: string, value: string }[]} */
  const profileChoices = []
  for (const line of credentialsTxt.split("\n")) {
    const match = line.match(/\[(.*)\]/)
    if (!match) continue
    const profile = match[1]
    profileChoices.push({ name: profile, value: profile })
  }

  /** @type {{ profile: string }} */
  const { profile } = await inquirer.prompt({
    type: "list",
    message: "AWS Profile を選択してください",
    name: "profile",
    choices: profileChoices
  })

  /** @type {{ region: string }} */
  const { region } = await inquirer.prompt({
    type: "input",
    message: "リージョンを入力してください",
    name: "region",
    default: 'ap-northeast-1',
  })

  const chance = new Chance()
  const credentials = fromIni({ profile })
  const appSyncClient = new AppSyncClient({ credentials, region })
  const dynamoDb = new DynamoDB({ credentials, region })


  // NOTE: AppSync
  const graphqlApiChoices = []
  let listGraphqlApisNextToken
  do {
    const result = await appSyncClient.send(new ListGraphqlApisCommand({ nextToken: listGraphqlApisNextToken }))
    for (const graphqlApi of result.graphqlApis) graphqlApiChoices.push({ name: graphqlApi.name, value: graphqlApi})
    listGraphqlApisNextToken = result.nextToken
  } while (!!listGraphqlApisNextToken)

  /** @type {{ graphqlApi: import('@aws-sdk/client-appsync').GraphqlApi }} */
  const { graphqlApi: { apiId } } = await inquirer.prompt({
    type: "list",
    message: "APIを選択してください",
    name: "graphqlApi",
    choices: graphqlApiChoices
  })

  const { dataSource: UserDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'UserTable' }))
  if (!UserDataSource) throw Error("User Datasouce が存在しません")
  const UserTableName = UserDataSource.dynamodbConfig.tableName
  if (!UserTableName) throw Error("User TableName が存在しません")

  const { dataSource: GroupDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'GroupTable' }))
  if (!GroupDataSource) throw Error("Group Datasouce が存在しません")
  const GroupTableName = GroupDataSource.dynamodbConfig.tableName
  if (!GroupTableName) throw Error("Group TableName が存在しません")

  const { dataSource: BookDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'BookTable' }))
  if (!BookDataSource) throw Error("Book Datasouce が存在しません")
  const BookTableName = BookDataSource.dynamodbConfig.tableName
  if (!BookTableName) throw Error("Book TableName が存在しません")

  const { dataSource: BookCategoryDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'BookCategoryTable' }))
  if (!BookCategoryDataSource) throw Error("BookCategory Datasouce が存在しません")
  const BookCategoryTableName = BookCategoryDataSource.dynamodbConfig.tableName
  if (!BookCategoryTableName) throw Error("BookCategory TableName が存在しません")

  const { dataSource: CommentDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'CommentTable' }))
  if (!CommentDataSource) throw Error("Comment Datasouce が存在しません")
  const CommentTableName = CommentDataSource.dynamodbConfig.tableName
  if (!CommentTableName) throw Error("Comment TableName が存在しません")

  const TableNames = [
    UserTableName,
    GroupTableName,
    BookTableName,
    BookCategoryTableName,
    CommentTableName,
  ]

  for (const TableName of TableNames) {
    console.log(`${TableName} のデータを削除中`)
    /** @type {Record<string, import("@aws-sdk/client-dynamodb").AttributeValue> | undefined} */
    let ExclusiveStartKey = null
    do {
      const result = await dynamoDb.scan({ TableName, ProjectionExpression: "id", ExclusiveStartKey })
      console.log(`${TableName} > ${result.Count} 件のデータが見つかりました。`)
      for (const item of result.Items ?? []) {
        const { id } = unmarshall(item)
        if (!id) continue
        await dynamoDb.deleteItem({
          TableName, Key: marshall({id})
        })
      }
      console.log(`${TableName} > ${result.Count} 件のデータを削除しました。`)
      ExclusiveStartKey = result.LastEvaluatedKey
    } while (!!ExclusiveStartKey)
  }
}

main()
