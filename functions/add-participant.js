const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = function (context, event, callback) {
  const identity = event.identity
  const serviceSid = context.SERVICE_SID
  const conversationSid = context.CONVERSATION_SID
  const client = context.getTwilioClient()

  client.conversations
    .services(serviceSid)
    .conversations(conversationSid)
    .participants.create({ identity: identity })
    .then(participant => {
      response.setBody({
        participantSid: participant.sid
      })
      return callback(null, response)
    })
    .catch(err => callback(err))
}
