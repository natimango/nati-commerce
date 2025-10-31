import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Create order in database
        try {
          await createOrder(session)
          console.log('Order created successfully:', session.id)
        } catch (error) {
          console.error('Failed to create order:', error)
          // Don't return error to Stripe, log for manual processing
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('PaymentIntent succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('PaymentIntent failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function createOrder(session: Stripe.Checkout.Session) {
  // Retrieve full session with line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product'],
  })

  const orderData = {
    stripe_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent as string,
    customer_email: session.customer_email || session.metadata?.user_email,
    customer_name: session.customer_details?.name,
    customer_phone: session.customer_details?.phone,
    user_id: session.metadata?.user_id,

    // Shipping address
    shipping_address: session.shipping_details?.address,
    shipping_name: session.shipping_details?.name,

    // Billing address
    billing_address: session.customer_details?.address,

    // Payment details
    amount_total: session.amount_total ? session.amount_total / 100 : 0, // Convert from paise to rupees
    currency: session.currency,
    payment_status: session.payment_status,

    // Line items
    items: fullSession.line_items?.data.map((item) => ({
      product_id: (item.price?.product as Stripe.Product)?.metadata?.product_id,
      name: item.description,
      quantity: item.quantity,
      price: item.amount_total ? item.amount_total / 100 : 0,
      metadata: (item.price?.product as Stripe.Product)?.metadata,
    })),

    created_at: new Date(session.created * 1000),
  }

  // Store order in database via Express API
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create order: ${error}`)
  }

  return await response.json()
}
