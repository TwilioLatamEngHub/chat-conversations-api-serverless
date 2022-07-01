const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = function (context, event, callback) {
  const conversationSid = context.CONVERSATION_SID
  const serviceSid = context.SERVICE_SID
  const client = context.getTwilioClient()

  client.conversations
    .services(serviceSid)
    .conversations(conversationSid)
    .messages.list()
    .then(messages => messages.map(m => m.sid))
    .then(list => {
      const promises = list.map(async sid => {
        return await client.conversations
          .conversations(conversationSid)
          .messages(sid)
          .remove()
      })
      return Promise.all(promises)
    })
    .then(() => {
      response.setBody({
        removed: 'Messages removed'
      })
      callback(null, response)
    })
    .catch(err => callback({ result: err }))
}
