/**
 * Cart Recovery Worker - "The Invisible Salesman"
 *
 * Automatically sends recovery emails/SMS to users who abandoned their cart
 * Expected impact: 15-20% cart recovery rate
 */

import { Worker, Job } from 'bullmq';
import { connection } from '../setup';

// Mock imports (replace with your actual implementations)
// import { getCart } from '@/lib/medusa';
// import { sendEmail } from '@/lib/email';
// import { logEvent } from '@/lib/analytics';

interface CartRecoveryJob {
  cartId: string;
  email: string;
  userId: string;
  phone?: string;
}

/**
 * Cart Recovery Worker
 *
 * Triggered 1 hour after cart is updated
 * Checks if cart is still abandoned, then sends recovery message
 */
export const cartRecoveryWorker = new Worker(
  'transactional',
  async (job: Job<CartRecoveryJob>) => {
    // Only process cart-recovery jobs
    if (job.name !== 'cart-recovery') {
      return;
    }

    const { cartId, email, userId, phone } = job.data;

    console.log(`[Cart Recovery] Processing cart ${cartId} for user ${userId}`);

    try {
      // 1. Check if they completed purchase
      const cart = await getCart(cartId);

      if (cart.completed_at) {
        console.log(`[Cart Recovery] Cart ${cartId} already completed, skipping`);
        return { status: 'already_completed' };
      }

      // 2. Check if cart still has items
      if (!cart.items || cart.items.length === 0) {
        console.log(`[Cart Recovery] Cart ${cartId} is empty, skipping`);
        return { status: 'empty_cart' };
      }

      // 3. Check if items are still in stock
      const itemsInStock = cart.items.filter((item) => item.variant.inventory_quantity > 0);

      if (itemsInStock.length === 0) {
        console.log(`[Cart Recovery] All items out of stock, skipping`);
        return { status: 'out_of_stock' };
      }

      // 4. Send recovery email
      await sendEmail({
        to: email,
        subject: "Your cart is waiting (and so are we) 💛",
        template: 'abandoned-cart',
        data: {
          items: itemsInStock,
          total: cart.total,
          cartUrl: `https://nati.in/cart/${cartId}`,
          // Optional: Add urgency with discount code
          discountCode: 'COMEBACK10',
          discountAmount: 10,
        },
      });

      console.log(`[Cart Recovery] Email sent to ${email}`);

      // 5. Optional: Send SMS if phone is available
      if (phone) {
        await sendSMS({
          to: phone,
          message: `Your NATI cart is waiting! Complete your purchase: https://nati.in/cart/${cartId} (Use COMEBACK10 for 10% off)`,
        });

        console.log(`[Cart Recovery] SMS sent to ${phone}`);
      }

      // 6. Log the recovery attempt
      await logEvent(userId, 'cart_recovery_sent', {
        cartId,
        itemCount: itemsInStock.length,
        value: cart.total,
        channel: phone ? 'email+sms' : 'email',
      });

      return {
        status: 'sent',
        email,
        phone,
        itemCount: itemsInStock.length,
      };
    } catch (error) {
      console.error(`[Cart Recovery] Error processing cart ${cartId}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 jobs in parallel
    limiter: {
      max: 100, // Max 100 jobs
      duration: 60000, // Per minute (rate limiting)
    },
  }
);

// Event handlers
cartRecoveryWorker.on('completed', (job) => {
  console.log(`[Cart Recovery] Job ${job.id} completed:`, job.returnvalue);
});

cartRecoveryWorker.on('failed', (job, error) => {
  console.error(`[Cart Recovery] Job ${job?.id} failed:`, error);
});

cartRecoveryWorker.on('error', (error) => {
  console.error('[Cart Recovery] Worker error:', error);
});

/**
 * Mock implementations (replace with real ones)
 */

async function getCart(cartId: string) {
  // TODO: Replace with real Medusa.js cart fetch
  return {
    id: cartId,
    completed_at: null,
    items: [
      {
        variant: { inventory_quantity: 5 },
        title: 'Kalamkari Saree',
        price: 8500,
      },
    ],
    total: 8500,
  };
}

async function sendEmail(data: {
  to: string;
  subject: string;
  template: string;
  data: any;
}) {
  // TODO: Replace with real email service (Resend/Klaviyo)
  console.log(`[Email] Sending to ${data.to}: ${data.subject}`);
}

async function sendSMS(data: { to: string; message: string }) {
  // TODO: Replace with real SMS service (Gupshup)
  console.log(`[SMS] Sending to ${data.to}: ${data.message}`);
}

async function logEvent(userId: string, eventType: string, data: any) {
  // TODO: Replace with real event logging
  console.log(`[Event] User ${userId}: ${eventType}`, data);
}

/**
 * Helper: Schedule cart recovery job
 * Call this from your cart update Server Action
 *
 * @example
 * import { scheduleCartRecovery } from '@/lib/queue/workers/cart-recovery';
 *
 * export async function addToCart(productId: string) {
 *   const cart = await updateCart(productId);
 *   const user = await getCurrentUser();
 *
 *   if (user) {
 *     await scheduleCartRecovery(cart.id, user.email, user.id, user.phone);
 *   }
 * }
 */
export async function scheduleCartRecovery(
  cartId: string,
  email: string,
  userId: string,
  phone?: string
) {
  const { transactionalQueue } = await import('../setup');

  return transactionalQueue.add(
    'cart-recovery',
    { cartId, email, userId, phone },
    {
      delay: 60 * 60 * 1000, // 1 hour delay
      jobId: `cart-recovery-${cartId}`, // Prevent duplicate jobs
    }
  );
}

/**
 * Helper: Cancel cart recovery (e.g., when user completes checkout)
 *
 * @example
 * await cancelCartRecovery(cartId);
 */
export async function cancelCartRecovery(cartId: string) {
  const { transactionalQueue } = await import('../setup');

  const jobId = `cart-recovery-${cartId}`;
  const job = await transactionalQueue.getJob(jobId);

  if (job) {
    await job.remove();
    console.log(`[Cart Recovery] Cancelled recovery for cart ${cartId}`);
  }
}

export default cartRecoveryWorker;
