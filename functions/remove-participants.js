exports.handler = function (context, event, callback) {
  const conversationSid = context.CONVERSATION_SID
  const serviceSid = context.SERVICE_SID
  const client = context.getTwilioClient()
  const response = new Twilio.Response()
  const headers = {
    'Access-Control-Allow-Origin': '*', // change this after to the web URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  }
  response.setHeaders(headers)

  client.conversations
    .services(serviceSid)
    .conversations(conversationSid)
    .participants.list()
    .then(participants => participants.map(p => p.sid))
    .then(list => {
      const promises = list.map(async sid => {
        return await client.conversations
          .conversations(conversationSid)
          .participants(sid)
          .remove()
      })
      return Promise.all(promises)
    })
    .then(res => {
      response.setBody({
        removed: 'Participants removed!'
      })
      callback(null, response)
    })
    .catch(err => callback({ result: err }))
}
