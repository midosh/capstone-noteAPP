import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateNoteItemRequest } from '../../requests/UpdateNoteItemRequest'
import { updateNote } from '../../businessLogic/note'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')




export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 logger.info('Processing update Note event: ', event)

  const itemToUpdate: UpdateNoteItemRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const itemId = event.pathParameters.itemId

  const updatedItem= await updateNote(jwtToken,itemToUpdate,itemId)

   return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
     updatedItem
    })
  }

}
