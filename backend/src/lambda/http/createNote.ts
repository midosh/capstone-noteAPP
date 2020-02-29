import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateNoteItemRequest } from '../../requests/CreateNoteItemRequest'
import { createNote} from '../../businessLogic/note'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing create Note event: ', event)

  const itemReq: CreateNoteItemRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await createNote(itemReq, jwtToken)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  };
}
