const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient()

  const { participantType, number, identity } = event

  let trimmedNumber
  if (number) {
    trimmedNumber = number.trim()
  }

  let binding
  switch (participantType) {
    case 'whatsapp':
      binding = { address: `whatsapp:+${trimmedNumber}` }
      break
    case 'sms':
      binding = { address: `+${trimmedNumber}` }
      break
    case 'chat':
      binding = { identity }
      break
    default:
      break
  }

  client.conversations.participantConversations
    .list(binding)
    .then(participantConversations =>
      participantConversations.forEach(async p => {
        await client.conversations.conversations(p.conversationSid).remove()
      })
    )
    .then(() => callback(null, response))
    .catch(err => callback(err))
}
