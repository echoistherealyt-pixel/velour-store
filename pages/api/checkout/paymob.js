// pages/api/checkout/paymob.js
// دليل Paymob: https://docs.paymob.com/docs/accept-standard-redirect

import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { cartItems, billingData } = req.body

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const amountCents = totalAmount * 100 // Paymob بيشتغل بالقروش

  try {
    // ---- Step 1: Authentication ----
    const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: process.env.PAYMOB_API_KEY,
    })
    const authToken = authRes.data.token

    // ---- Step 2: Create Order ----
    const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      items: cartItems.map(i => ({
        name: i.nameEn,
        amount_cents: i.price * 100,
        description: i.nameAr,
        quantity: i.qty,
      })),
    })
    const paymobOrderId = orderRes.data.id

    // ---- Step 3: Payment Key ----
    const payKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: billingData || {
        apartment: 'NA', email: 'customer@example.com',
        floor: 'NA', first_name: 'Customer', street: 'NA',
        building: 'NA', phone_number: '+201000000000',
        shipping_method: 'NA', postal_code: 'NA',
        city: 'Cairo', country: 'EG',
        last_name: 'VELOUR', state: 'Cairo',
      },
      currency: 'EGP',
      integration_id: process.env.PAYMOB_INTEGRATION_ID_CARD,
    })
    const paymentKey = payKeyRes.data.token

    // ---- Return iframe URL ----
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`

    res.status(200).json({ url: iframeUrl, orderId: paymobOrderId })
  } catch (err) {
    console.error('Paymob error:', err?.response?.data || err.message)
    res.status(500).json({ error: 'Paymob checkout failed' })
  }
}
