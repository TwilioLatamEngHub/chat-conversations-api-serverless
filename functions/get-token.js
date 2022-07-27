const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = function (context, event, callback) {
  const twilioAccountSid = context.ACCOUNT_SID
  const twilioApiKey = context.API_KEY
  const twilioApiSecret = context.API_SECRET
  const serviceSid = context.SERVICE_SID

  const { identity } = event

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
    { identity: identity, ttl: 3600 }
  )

  token.addGrant(chatGrant)

  response.setBody({
    accessToken: token.toJwt()
  })

  return callback(null, response)
}
