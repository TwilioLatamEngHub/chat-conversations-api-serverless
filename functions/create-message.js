const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const serviceSid = context.SERVICE_SID
  const client = context.getTwilioClient()

  const { conversationSid, author, body } = event

  client.conversations.v1
    .services(serviceSid)
    .conversations(conversationSid)
    .messages.create({ author, body })
    .then(message => response.setBody({ message }))
    .then(() => callback(null, response))
    .catch(err => callback(err))
}
