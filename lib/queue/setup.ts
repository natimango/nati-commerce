/**
 * BullMQ Queue Setup
 *
 * Replaces Google Pub/Sub with Redis-based job queues.
 * Three queues: transactional, analytics, ai-jobs
 *
 * Cost savings: ~₹2,000/mo + simpler dev experience
 */

import { Queue, QueueOptions } from 'bullmq';
import { Redis } from 'ioredis';

// Redis connection (use your Google Memorystore connection string)
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Required for BullMQ
});

// Queue configuration
const defaultQueueOptions: QueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 604800, // Keep failed jobs for 7 days
    },
  },
};

/**
 * Transactional Queue
 * High priority, immediate processing
 *
 * Jobs:
 * - send-email
 * - send-sms
 * - cart-recovery
 * - order-confirmation
 * - notify-waitlist
 */
export const transactionalQueue = new Queue('transactional', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 1, // High priority
  },
});

/**
 * Analytics Queue
 * Medium priority, batched processing
 *
 * Jobs:
 * - bigquery-batch-insert
 * - event-aggregation
 * - daily-report
 */
export const analyticsQueue = new Queue('analytics', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 5, // Medium priority
  },
});

/**
 * AI Jobs Queue
 * Low priority, heavy processing
 *
 * Jobs:
 * - calculate-heat-scores
 * - generate-embeddings
 * - update-recommendations
 * - train-model (future)
 */
export const aiJobsQueue = new Queue('ai-jobs', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 10, // Low priority
  },
});

/**
 * Helper: Add job to transactional queue
 *
 * @example
 * await addTransactionalJob('send-email', {
 *   to: 'user@example.com',
 *   template: 'order-confirmation',
 *   data: { orderId: '123' }
 * });
 */
export async function addTransactionalJob(name: string, data: any, options = {}) {
  return transactionalQueue.add(name, data, options);
}

/**
 * Helper: Add job to analytics queue
 *
 * @example
 * await addAnalyticsJob('bigquery-batch-insert', {
 *   table: 'events',
 *   rows: [...]
 * });
 */
export async function addAnalyticsJob(name: string, data: any, options = {}) {
  return analyticsQueue.add(name, data, options);
}

/**
 * Helper: Add job to AI queue
 *
 * @example
 * await addAIJob('calculate-heat-scores', {});
 */
export async function addAIJob(name: string, data: any, options = {}) {
  return aiJobsQueue.add(name, data, options);
}

/**
 * Schedule a delayed job (for cart recovery, etc.)
 *
 * @example
 * await scheduleJob('cart-recovery', { cartId: '123', email: 'user@example.com' }, 3600000); // 1 hour
 */
export async function scheduleJob(
  name: string,
  data: any,
  delayMs: number,
  queue: 'transactional' | 'analytics' | 'ai-jobs' = 'transactional'
) {
  const queueMap = {
    transactional: transactionalQueue,
    analytics: analyticsQueue,
    'ai-jobs': aiJobsQueue,
  };

  return queueMap[queue].add(name, data, {
    delay: delayMs,
    jobId: `${name}-${data.cartId || data.userId || Date.now()}`, // Prevent duplicates
  });
}

/**
 * Schedule a recurring job (cron-like)
 *
 * @example
 * await scheduleRecurringJob('calculate-heat-scores', {}, '0 2 * * *'); // Daily at 2 AM
 */
export async function scheduleRecurringJob(
  name: string,
  data: any,
  cronExpression: string,
  queue: 'transactional' | 'analytics' | 'ai-jobs' = 'ai-jobs'
) {
  const queueMap = {
    transactional: transactionalQueue,
    analytics: analyticsQueue,
    'ai-jobs': aiJobsQueue,
  };

  return queueMap[queue].add(name, data, {
    repeat: {
      pattern: cronExpression,
    },
    jobId: `recurring-${name}`, // Ensure only one recurring job
  });
}

/**
 * Get queue stats (for monitoring dashboard)
 *
 * @example
 * const stats = await getQueueStats('transactional');
 * // { waiting: 5, active: 2, completed: 1234, failed: 3 }
 */
export async function getQueueStats(queueName: 'transactional' | 'analytics' | 'ai-jobs') {
  const queueMap = {
    transactional: transactionalQueue,
    analytics: analyticsQueue,
    'ai-jobs': aiJobsQueue,
  };

  const queue = queueMap[queueName];

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return { waiting, active, completed, failed, delayed };
}

/**
 * Clear all jobs in a queue (use with caution!)
 *
 * @example
 * await clearQueue('ai-jobs'); // Clear all AI jobs
 */
export async function clearQueue(queueName: 'transactional' | 'analytics' | 'ai-jobs') {
  const queueMap = {
    transactional: transactionalQueue,
    analytics: analyticsQueue,
    'ai-jobs': aiJobsQueue,
  };

  const queue = queueMap[queueName];

  await queue.drain(); // Remove all waiting/delayed jobs
  await queue.clean(0, 100, 'completed'); // Remove completed jobs
  await queue.clean(0, 100, 'failed'); // Remove failed jobs

  console.log(`[Queue] Cleared ${queueName} queue`);
}

/**
 * Graceful shutdown
 * Call this on process exit
 */
export async function closeQueues() {
  await Promise.all([
    transactionalQueue.close(),
    analyticsQueue.close(),
    aiJobsQueue.close(),
    connection.quit(),
  ]);

  console.log('[Queue] All queues closed');
}

// Export Redis connection for workers
export { connection };
