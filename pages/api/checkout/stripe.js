// pages/api/checkout/stripe.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { cartItems, currency = 'egp' } = req.body

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }

  try {
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.nameEn,
          description: item.nameAr,
        },
        unit_amount: item.price * 100, // Stripe بيشتغل بالقروش
      },
      quantity: item.qty,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        store: 'VELOUR',
      },
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
