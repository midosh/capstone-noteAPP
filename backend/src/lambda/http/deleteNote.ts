import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteNote } from '../../businessLogic/note'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing delete Note event: ', event)

  const itemId = event.pathParameters.itemId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  const deletedItem= await deleteNote(jwtToken,itemId)

return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      deletedItem
    })
  };
}

