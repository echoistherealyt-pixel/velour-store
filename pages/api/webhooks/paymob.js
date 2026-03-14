// pages/api/webhooks/paymob.js
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { obj, hmac } = req.body

  // ---- Verify HMAC ----
  const hmacFields = [
    obj.amount_cents, obj.created_at, obj.currency,
    obj.error_occured, obj.has_parent_transaction, obj.id,
    obj.integration_id, obj.is_3d_secure, obj.is_auth,
    obj.is_capture, obj.is_refunded, obj.is_standalone_payment,
    obj.is_voided, obj.order?.id, obj.owner, obj.pending,
    obj.source_data?.pan, obj.source_data?.sub_type, obj.source_data?.type,
    obj.success,
  ]
  const concatenated = hmacFields.join('')
  const calculatedHmac = crypto
    .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
    .update(concatenated)
    .digest('hex')

  if (calculatedHmac !== hmac) {
    console.error('Invalid HMAC — possible fraud attempt')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  // ---- Handle payment result ----
  if (obj.success === true) {
    console.log('✅ Payment confirmed — Order:', obj.order?.id)
    // هنا تقدر تحدث قاعدة البيانات أو ترسل إيميل تأكيد
  } else {
    console.log('❌ Payment failed — Order:', obj.order?.id)
  }

  res.status(200).json({ received: true })
}
