exports.handler = function (context, event, callback) {
  const identity = event.identity
  const serviceSid = context.SERVICE_SID
  const conversationSid = context.CONVERSATION_SID
  const client = context.getTwilioClient()
  const response = new Twilio.Response()
  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  client.conversations
    .services(serviceSid)
    .conversations(conversationSid)
    .participants.create({ identity: identity })
    .then(participant => {
      response.setHeaders(headers)
      response.setBody({
        participantSid: participant.sid
      })
      return callback(null, response)
    })
    .catch(err => callback(err))
}
