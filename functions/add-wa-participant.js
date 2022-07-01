const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = function (context, event, callback) {
  const personalNumber = event.number.trim() // trim so we don't have to decode plus sign client-side, since it arrives as an empty space
  const twilioNumber = context.TWILIO_NUMBER
  const serviceSid = context.SERVICE_SID
  const conversationSid = context.CONVERSATION_SID
  const client = context.getTwilioClient()

  client.conversations
    .services(serviceSid)
    .conversations(conversationSid)
    .participants.create({
      'messagingBinding.address': `whatsapp:+${personalNumber}`,
      'messagingBinding.proxyAddress': `whatsapp:${twilioNumber}`
    })
    .then(participant => {
      response.setBody({
        participantSid: participant.sid
      })
      return callback(null, response)
    })
    .catch(err => callback(err))
}
