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
import { marshall } from '@aws-sdk/util-dynamodb'

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

  /** @type {{ profile: number }} */
  const { profile } = await inquirer.prompt({
    type: "list",
    message: "AWS Profile を選択してください",
    name: "profile",
    choices: profileChoices
  })

  /** @type {{ region: number }} */
  const { region } = await inquirer.prompt({
    type: "input",
    message: "リージョンを入力してください",
    name: "region",
    default: 'ap-northeast-1',
  })

  const chance = new Chance()
  const credentials = fromIni({ profile })
  const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({ credentials, region })
  const appSyncClient = new AppSyncClient({ credentials, region })
  const dynamoDb = new DynamoDB({ credentials, region })

  // NOTE: UserPool
  const userPoolChoices = []
  let listUserPoolsNextToken
  do {
    const result = await cognitoIdentityProviderClient.send(new ListUserPoolsCommand({ NextToken: listUserPoolsNextToken }))
    for (const UserPool of result.UserPools) userPoolChoices.push({ name: UserPool.Name, value: UserPool})
    listUserPoolsNextToken = result.NextToken
  } while (!!listUserPoolsNextToken)

  /** @type {{ UserPool: import('@aws-sdk/client-cognito-identity-provider').UserPoolType }} */
  const { UserPool } = await inquirer.prompt({
    type: "list",
    message: "UserPool を選択してください",
    name: "UserPool",
    choices: userPoolChoices
  })

  // NOTE: Cognito User
  /** @type {{ name: string, value: import('@aws-sdk/client-cognito-identity-provider').UserType | null }[]} */
  const userChoices = []
  let listUsersNextToken
  do {
    const result = await cognitoIdentityProviderClient.send(new ListUsersCommand({ UserPoolId: UserPool.Id }))
    for (const User of result.Users) {
      let name = 'NO_NAME'
      for (const Attribute of User.Attributes) {
        if (Attribute.Name !== "name") continue
        name = `${Attribute.Value}`
        break
      }
      name += ` (${User.Username})`
      userChoices.push({ name, value: User })
    }
    listUsersNextToken = result.NextToken
  } while (!!listUsersNextToken)

  /** @type {import('@aws-sdk/client-cognito-identity-provider').UserType | null} */
  let User = null

  if (userChoices.length > 0) {
    userChoices.push({
      name: "新規作成する",
      value: null
    })

    /** @type {{ User: import('@aws-sdk/client-cognito-identity-provider').UserType | null }} */
    const { SelectedUser } = await inquirer.prompt({
      type: "list",
      message: "User を選択してください",
      name: "SelectedUser",
      choices: userChoices
    })
    User = SelectedUser
  }

  if (User === null) {
    /** @type {{ region: number }} */
    const { email } = await inquirer.prompt({
      type: "input",
      message: "メールアドレスを入力してください",
      name: "email"
    })

    /** @type {{ region: number }} */
    const { UserName } = await inquirer.prompt({
      type: "input",
      message: "ユーザの名前を入力してください",
      name: "UserName",
      default: `テストユーザー(${format(new Date(), 'yyyyMMddHHmm')})`,
    })

    const result = await cognitoIdentityProviderClient.send(new AdminCreateUserCommand({
      UserPoolId: UserPool.Id,
      Username: email,
      UserAttributes: [{
        Name: "name",
        Value: UserName
      }, {
        Name: 'email',
        Value: email,
      }, {
        Name: 'email_verified',
        Value: 'true'
      }],
      DesiredDeliveryMediums: ['EMAIL']
    }))
    if (!result.User) throw Error("ユーザの作成に失敗しました")
    User = result.User
  }

  if (!User) throw Error("ユーザが選択されていません")

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

  const { dataSource: MessageDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'MessageTable' }))
  if (!MessageDataSource) throw Error("Message Datasouce が存在しません")
  const MessageTableName = MessageDataSource.dynamodbConfig.tableName
  if (!MessageTableName) throw Error("Message TableName が存在しません")

  const { dataSource: ScheduleDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'ScheduleTable' }))
  if (!ScheduleDataSource) throw Error("Schedule Datasouce が存在しません")
  const ScheduleTableName = ScheduleDataSource.dynamodbConfig.tableName
  if (!ScheduleTableName) throw Error("Schedule TableName が存在しません")

  const { dataSource: PostCategoryDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'PostCategoryTable' }))
  if (!PostCategoryDataSource) throw Error("PostCategory Datasouce が存在しません")
  const PostCategoryTableName = PostCategoryDataSource.dynamodbConfig.tableName
  if (!PostCategoryTableName) throw Error("PostCategory TableName が存在しません")

  const { dataSource: PostDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'PostTable' }))
  if (!PostDataSource) throw Error("Post Datasouce が存在しません")
  const PostTableName = PostDataSource.dynamodbConfig.tableName
  if (!PostTableName) throw Error("Post TableName が存在しません")

  const { dataSource: TodoDataSource } = await appSyncClient.send(new GetDataSourceCommand({ apiId, name: 'TodoTable' }))
  if (!TodoDataSource) throw Error("Todo Datasouce が存在しません")
  const TodoTableName = TodoDataSource.dynamodbConfig.tableName
  if (!TodoTableName) throw Error("Todo TableName が存在しません")

  /** @type {{ groupCount: number }} */
  const { groupCount } = await inquirer.prompt({
    type: "number",
    message: "作成するグループの数を入力してください",
    name: "groupCount",
    default: 20,
  })

  /** @type {{ userCount: number }} */
  const { userCount } = await inquirer.prompt({
    type: "number",
    message: "作成するユーザの数を入力してください",
    name: "userCount",
    default: 200,
  })

  /** @type {{ bookCategoryCount: number }} */
  const { bookCategoryCount } = await inquirer.prompt({
    type: "number",
    message: "作成する本のカテゴリの数を入力してください",
    name: "bookCategoryCount",
    default: 400,
  })

  /** @type {{ bookCount: number }} */
  const { bookCount } = await inquirer.prompt({
    type: "number",
    message: "作成する本の数を入力してください",
    name: "bookCount",
    default: 2000,
  })

  /** @type {{ commentCount: number }} */
  const { commentCount } = await inquirer.prompt({
    type: "number",
    message: "コメントの数を入力してください",
    name: "commentCount",
    default: 10000,
  })

  /** @type {{ messageCount: number }} */
  const { messageCount } = await inquirer.prompt({
    type: "number",
    message: "メッセージの数を入力してください",
    name: "messageCount",
    default: 1000,
  })

  /** @type {{ scheduleCount: number }} */
  const { scheduleCount } = await inquirer.prompt({
    type: "number",
    message: "予定の数を入力してください",
    name: "scheduleCount",
    default: 1000,
  })

  /** @type {{ messageCount: number }} */
  const { postCategoryCount } = await inquirer.prompt({
    type: "number",
    message: "記事分類の数を入力してください",
    name: "postCategory",
    default: 20,
  })

  /** @type {{ postCount: number }} */
  const { postCount } = await inquirer.prompt({
    type: "number",
    message: "記事の数を入力してください",
    name: "postCount",
    default: 1000,
  })

  /** @type {{ todoCount: number }} */
  const { todoCount } = await inquirer.prompt({
    type: "number",
    message: "作業の数を入力してください",
    name: "todoCount",
    default: 1000,
  })

  /** @type {string[]} */
  const groupIds = []

  /** @type {string[]} */
  const userIds = []

  /** @type {string[]} */
  const bookCategoryIds = []

  /** @type {string[]} */
  const bookIds = []

  /** @type {string[]} */
  const postCategoryIds = []

  const owner = User.Username
  if (!owner) throw Error("User.Username がありません")
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  /** @type {Promise<import('@aws-sdk/client-dynamodb').PutItemCommandOutput>[]} */
  const createPromises = []

  for (let i = 0; i < groupCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: GroupTableName,
        Item: marshall({
          __typename: 'Group',
          id, createdAt, updatedAt, owner,
          name: chance.word(),
        })
      })
    )
    groupIds.push(id)
  }

  for (let i = 0; i < userCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: UserTableName,
        Item: marshall({
          __typename: 'User',
          id, createdAt, updatedAt, owner,
          name: chance.name(),
          bornedDate: chance.birthday().toISOString(),
          groupId: chance.pickone(groupIds)
        })
      })
    )
    userIds.push(id)
  }

  for (let i = 0; i < bookCategoryCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: BookCategoryTableName,
        Item: marshall({
          __typename: 'BookCategory',
          id, createdAt, updatedAt, owner,
          name: chance.name(),
          groupId: chance.pickone(groupIds)
        })
      })
    )
    bookCategoryIds.push(id)
  }

  for (let i = 0; i < bookCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: BookTableName,
        Item: marshall({
          __typename: 'Book',
          id, createdAt, updatedAt, owner,
          name: chance.name(),
          groupId: chance.pickone(groupIds),
          categoryId: chance.pickone(bookCategoryIds),
        })
      })
    )
    bookIds.push(id)
  }

  for (let i = 0; i < commentCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: CommentTableName,
        Item: marshall({
          __typename: 'Comment',
          id, createdAt, updatedAt, owner,
          name: chance.name(),
          groupId: chance.pickone(groupIds),
          userId: chance.pickone(userIds),
          categoryId: chance.pickone(bookCategoryIds),
          contents: chance.paragraph({ sentences: 10 })
        })
      })
    )
  }

  for (let i = 0; i < messageCount; i++) {
    const id = uuid()
    const [from, to] = chance.pickset(userIds, 2)
    createPromises.push(
      dynamoDb.putItem({
        TableName: MessageTableName,
        Item: marshall({
          __typename: 'Message',
          id, createdAt, updatedAt, owner,
          groupId: chance.pickone(groupIds),
          from: from,
          to: to,
          contents: chance.paragraph({ sentences: 10 })
        })
      })
    )
  }

  for (let i = 0; i < scheduleCount; i++) {
    const id = uuid()
    const startedAt = chance.date()
    const finishedAt = new Date(base.getTime() + chance.integer({ min:0, max: 24 * 60 * 60 * 1000 }))
    createPromises.push(
      dynamoDb.putItem({
        TableName: ScheduleTableName,
        Item: marshall({
          __typename: 'Schedule',
          id, createdAt, updatedAt, owner,
          startedAt: startedAt.toISOString(),
          finishedAt: finishedAt.toISOString(),
          groupId: chance.pickone(groupIds),
          comment: chance.paragraph({ sentences: 1 })
        })
      })
    )
  }

  for (let i = 0; i < postCategoryCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: ScheduleTableName,
        Item: marshall({
          __typename: 'Schedule',
          id, createdAt, updatedAt, owner,
          name: chance.name(),
          groupId: chance.pickone(groupIds),
        })
      })
    )
    postCategoryIds.push(id)
  }

  for (let i = 0; i < postCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: PostTableName,
        Item: marshall({
          __typename: 'Post',
          id, createdAt, updatedAt, owner,
          title: chance.sentence(),
          contents: chance.paragraph({ sentences: 30 }),
          categoryId: chance.pickone(postCategoryIds),
          groupId: chance.pickone(groupIds),
        })
      })
    )
  }

  for (let i = 0; i < todoCount; i++) {
    const id = uuid()
    createPromises.push(
      dynamoDb.putItem({
        TableName: TodoTableName,
        Item: marshall({
          __typename: 'Todo',
          id, createdAt, updatedAt, owner,
          title: chance.sentence(),
          done: chance.bool(),
          groupId: chance.pickone(groupIds),
        })
      })
    )
  }

  console.log("全ての作成を開始しました。")
  await Promise.all(createPromises)
  console.log(`${createPromises.length}件のデータを作成を完了しました。`)
}

main()
