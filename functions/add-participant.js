const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = function (context, event, callback) {
  const twilioNumber = context.TWILIO_NUMBER
  const serviceSid = context.SERVICE_SID
  const client = context.getTwilioClient()

  const { participantType, conversationSid, identity, number } = event

  // trim so we don't have to decode plus sign client-side, since it arrives as an empty space
  let trimmedNumber
  if (number) {
    trimmedNumber = number.trim()
  }

  let binding
  switch (participantType) {
    case 'whatsapp':
      binding = {
        'messagingBinding.address': `whatsapp:+${trimmedNumber}`,
        'messagingBinding.proxyAddress': `whatsapp:${twilioNumber}`
      }
      break
    case 'sms':
      binding = {
        'messagingBinding.address': `+${trimmedNumber}`,
        'messagingBinding.proxyAddress': `${twilioNumber}`
      }
      break
    case 'chat':
      binding = { identity }
      break
    default:
      break
  }

  client.conversations
    .services(serviceSid)
    .conversations(conversationSid)
    .participants.create(binding)
    .then(participant => response.setBody({ participant }))
    .then(() => callback(null, response))
    .catch(err => {
      if (err.code === 50433) {
        response.setBody({ participantSid: 'exists' })
        return callback(null, response)
      }
      if (err.code === 50416) {
        response.setBody({
          error:
            'A binding for this participant and proxy address already exists'
        })
        return callback(null, response)
      }
      return callback(err)
    })
}
