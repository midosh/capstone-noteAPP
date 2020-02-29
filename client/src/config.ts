// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'xzshvwds61'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'note-app.auth0.com',            // Auth0 domain
  clientId: '1FhQNwQhlw30l3itLa3nT1iwc8Q82Yfs',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
