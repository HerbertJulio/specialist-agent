# Payments & Finance

::: info Agents: `@finance` · Time: 10-15 min per scenario
:::

Real scenarios for payment integration, billing, and financial features.

## Stripe Checkout {#stripe}

**Goal:** Add Stripe payment checkout.

**Command:**
```
Integrate Stripe checkout for one-time payments
```

**What happens:**
1. Creates payment service
2. Implements checkout session
3. Adds webhook handling
4. Creates payment confirmation UI

**Result:**
```typescript
// Backend: Create checkout session
app.post('/api/checkout', async (req, res) => {
  const { items, successUrl, cancelUrl } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100  // cents
      },
      quantity: item.quantity
    })),
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl
  })

  res.json({ sessionId: session.id })
})

// Backend: Handle webhook
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  )

  switch (event.type) {
    case 'checkout.session.completed':
      await handlePaymentSuccess(event.data.object)
      break
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
  }

  res.json({ received: true })
})

// Frontend: Redirect to checkout
async function handleCheckout(items) {
  const response = await api.post('/checkout', {
    items,
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cart`
  })

  const stripe = await loadStripe(STRIPE_PUBLIC_KEY)
  await stripe.redirectToCheckout({
    sessionId: response.sessionId
  })
}
```

---

## Subscription Billing {#subscriptions}

**Goal:** Add monthly subscription plans.

**Command:**
```
Implement subscription billing with monthly and yearly plans
```

**Result:**
```typescript
// Plans
const plans = {
  basic: {
    monthly: 'price_basic_monthly',   // $9/mo
    yearly: 'price_basic_yearly'      // $90/yr
  },
  pro: {
    monthly: 'price_pro_monthly',     // $29/mo
    yearly: 'price_pro_yearly'        // $290/yr
  }
}

// Create subscription
app.post('/api/subscribe', async (req, res) => {
  const { planId, billingCycle, userId } = req.body

  // Get or create Stripe customer
  let customer = await getStripeCustomer(userId)
  if (!customer) {
    customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId }
    })
  }

  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: plans[planId][billingCycle] }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  })

  res.json({
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret
  })
})

// Handle subscription events
app.post('/api/webhooks/stripe', async (req, res) => {
  switch (event.type) {
    case 'customer.subscription.created':
      await activateSubscription(event.data.object)
      break
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object)
      break
    case 'invoice.payment_failed':
      await handleFailedPayment(event.data.object)
      break
  }
})

// Check subscription status
function hasActiveSubscription(user) {
  return user.subscription?.status === 'active'
}

function canAccessFeature(user, feature) {
  const plan = user.subscription?.plan
  return planFeatures[plan]?.includes(feature)
}
```

---

## Invoice Generation {#invoices}

**Goal:** Generate PDF invoices for orders.

**Command:**
```
Create invoice generation system with PDF export
```

**Result:**
```typescript
// Invoice data structure
interface Invoice {
  number: string      // INV-2024-00001
  date: Date
  dueDate: Date
  customer: {
    name: string
    email: string
    address: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
}

// Generate invoice number
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const count = await Invoice.count({ year })
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`
}

// Create invoice
app.post('/api/invoices', async (req, res) => {
  const invoice = await createInvoice({
    ...req.body,
    number: await generateInvoiceNumber(),
    status: 'draft'
  })

  res.json(invoice)
})

// Generate PDF
app.get('/api/invoices/:id/pdf', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
  const pdf = await generateInvoicePDF(invoice)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition',
    `attachment; filename="${invoice.number}.pdf"`)
  res.send(pdf)
})

// Send invoice email
app.post('/api/invoices/:id/send', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
  const pdf = await generateInvoicePDF(invoice)

  await sendEmail({
    to: invoice.customer.email,
    subject: `Invoice ${invoice.number}`,
    template: 'invoice',
    data: { invoice },
    attachments: [{ filename: `${invoice.number}.pdf`, content: pdf }]
  })

  await Invoice.updateStatus(invoice.id, 'sent')
  res.json({ sent: true })
})
```

---

## Financial Dashboard {#dashboard}

**Goal:** Create revenue and metrics dashboard.

**Command:**
```
Create financial dashboard with MRR, churn, and revenue metrics
```

**Result:**
```typescript
// Metrics
interface FinancialMetrics {
  mrr: number                    // Monthly Recurring Revenue
  arr: number                    // Annual Recurring Revenue
  churnRate: number              // % customers lost per month
  ltv: number                    // Lifetime Value
  newMrr: number                 // From new customers this month
  expansionMrr: number           // From upgrades
  contractionMrr: number         // From downgrades
  churnedMrr: number             // From cancellations
}

// Calculate MRR
async function calculateMRR(): Promise<number> {
  const activeSubscriptions = await Subscription.find({
    status: 'active'
  })

  return activeSubscriptions.reduce((sum, sub) => {
    const monthlyAmount = sub.billingCycle === 'yearly'
      ? sub.amount / 12
      : sub.amount
    return sum + monthlyAmount
  }, 0)
}

// Calculate churn rate
async function calculateChurnRate(month: Date): Promise<number> {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  const customersAtStart = await Customer.count({
    createdAt: { $lt: startOfMonth },
    cancelledAt: { $gte: startOfMonth }
  })

  const customersCancelled = await Customer.count({
    cancelledAt: {
      $gte: startOfMonth,
      $lte: endOfMonth
    }
  })

  return (customersCancelled / customersAtStart) * 100
}

// Dashboard endpoint
app.get('/api/dashboard/financial', async (req, res) => {
  const [mrr, churnRate, revenueByMonth] = await Promise.all([
    calculateMRR(),
    calculateChurnRate(new Date()),
    getRevenueByMonth(12)
  ])

  res.json({
    mrr,
    arr: mrr * 12,
    churnRate,
    ltv: mrr / (churnRate / 100),
    revenueChart: revenueByMonth
  })
})
```

---

## Quick Tips

### Money in Cents

```typescript
// Always store money as integers (cents)
const price = 1999        // $19.99
const total = price * qty // No floating point errors

// Convert for display
const display = (price / 100).toFixed(2) // "19.99"
```

### Webhook Idempotency

```typescript
// Store processed webhook IDs
app.post('/webhooks', async (req, res) => {
  const eventId = req.body.id

  if (await isEventProcessed(eventId)) {
    return res.json({ received: true })
  }

  await processEvent(req.body)
  await markEventProcessed(eventId)

  res.json({ received: true })
})
```

---

## Related Scenarios

- [Security](/scenarios/security) - Secure payment flow
- [API Design](/scenarios/api-design) - Design payment API
- [Infrastructure](/scenarios/infrastructure) - Deploy securely
