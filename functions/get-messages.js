const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const serviceSid = context.SERVICE_SID
  const client = context.getTwilioClient()

  const { conversationSid } = event

  client.conversations.v1
    .services(serviceSid)
    .conversations(conversationSid)
    .messages.list()
    .then(messages => response.setBody({ messages }))
    .then(() => callback(null, response))
    .catch(err => callback(err))
}
