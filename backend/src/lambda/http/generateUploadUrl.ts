import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/note'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info('Processing generateUploadUrl event: ', event)

  const itemId = event.pathParameters.itemId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const uploadUrl = await generateUploadUrl(jwtToken,itemId)

 return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  };
}


