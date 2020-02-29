import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)


import { NoteItem} from '../models/NoteItem'
import { NoteItemUpdate } from '../models/NoteItemUpdate'
import { createLogger } from '../utils/logger'
const logger = createLogger('auth')



export class NoteAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly noteTable = process.env.NOTE_TABLE ,
    private readonly userIndex = process.env.USER_ID_INDEX,
    private readonly bucketName = process.env.NOTE_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly s3 = new AWS.S3({
    signatureVersion: 'v4'
    })

    ) {}

  async getNotes(userId: string): Promise<NoteItem[]> {
    console.log('Getting all notes')

    const result = await this.docClient.query({
       TableName : this.noteTable,
       IndexName : this.userIndex,
       KeyConditionExpression: 'userId = :userId',
       ExpressionAttributeValues: {
         ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as NoteItem[]
  } 

  async deleteNote(userId: string,itemId: string){
    const deleted = await this.docClient.delete({
        TableName: this.noteTable,
        Key: {
          userId,
          itemId
        }
      }).promise();

     return deleted;

  }

  async generateUploadUrl(userId: string,itemId:string){
    const validItemId = await this.noteExists(userId,itemId)
  if (!validItemId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Note does not exist'
      })
    }
  }

  const uploadUrl= this.s3.getSignedUrl('putObject', {
    Bucket: this.bucketName,
    Key: itemId,
    Expires: this.urlExpiration
  })

   await this.docClient.update({
        TableName: this.noteTable,
        Key: { userId, itemId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ":attachmentUrl":`https://${this.bucketName}.s3.amazonaws.com/${itemId}`
        },
      }).promise();

   return uploadUrl;
  }

async  noteExists(userId: string,itemId: string) {
  const result = await this.docClient
    .get({
      TableName: this.noteTable,
      Key: {
        userId,
        itemId

      }
    })
    .promise()

  logger.info('Get Item: ', result)
  return !!result.Item
}

async updateNote(userId:string,updatedNote: NoteItemUpdate, itemId:string){
  const newUpdatedNote = await this.docClient.update({
      TableName: this.noteTable,
      Key: { userId, itemId },
      UpdateExpression: 'set name = :name, dueDate = :date, done = :done',
      ExpressionAttributeValues: {
        ':name':updatedNote.name,
        ':date':updatedNote.dueDate,
        ':done':updatedNote.done
      },
      ReturnValues: "ALL_NEW"
    }).promise();

  return newUpdatedNote
}

async createNote(item: NoteItem): Promise<NoteItem> {
    
  await this.docClient.put({
      TableName: this.noteTable,
      Item: item
    }).promise()
  
    return item;

  }
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}