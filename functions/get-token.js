exports.handler = function (context, event, callback) {
  const twilioAccountSid = context.ACCOUNT_SID
  const twilioApiKey = context.API_KEY
  const twilioApiSecret = context.API_SECRET
  const serviceSid = context.SERVICE_SID
  const identity = event.identity

  const AccessToken = Twilio.jwt.AccessToken
  const ChatGrant = AccessToken.ChatGrant

  // Create a "grant" which enables a client to use Chat as a given user,
  // on a given device
  const chatGrant = new ChatGrant({
    serviceSid: serviceSid
  })

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity }
  )

  token.addGrant(chatGrant)

  const response = new Twilio.Response()
  const headers = {
    'Access-Control-Allow-Origin': '*', // change this to your client-side URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  response.setHeaders(headers)
  response.setBody({
    accessToken: token.toJwt()
  })

  return callback(null, response)
}
