import { config } from '../../../utils/config'

export const sendEmail = async ({
  tos,
  subject,
  content,
}: {
  tos: string[]
  subject: string
  content: string
}) => {
  const basicHeader = Buffer.from(
    `${config.CLICK_SEND_USERNAME}:${config.CLICK_SEND_API_KEY}`
  ).toString('base64')

  const res = await fetch('https://rest.clicksend.com/v3/email/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicHeader}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: [...tos.map((x) => ({ email: x, name: x }))],
      from: {
        email_address_id: config.CLICK_SEND_FROM,
        name: '2FA Group',
      },
      subject: subject,
      body: content,
    }),
  })

  console.log('Email response: ', res.status, await res.text())
  return res
}
