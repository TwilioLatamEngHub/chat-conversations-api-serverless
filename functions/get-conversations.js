const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const serviceSid = context.SERVICE_SID
  const client = context.getTwilioClient()

  client.conversations.v1
    .services(serviceSid)
    .conversations.list()
    .then(conversations => response.setBody({ conversations }))
    .then(() => callback(null, response))
    .catch(err => callback(err))
}
