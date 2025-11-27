/**
 * Heat Score Calculator - "The Invisible Merchandiser"
 *
 * Automatically calculates and updates product "heat" based on user activity
 * Hot products automatically get promoted in listings
 *
 * Formula: (views * 1) + (add_to_cart * 5) + (purchases * 10) + (shares * 3)
 * With exponential time decay (recent events worth more)
 *
 * Runs: Nightly at 2 AM UTC
 */

import { Worker, Job } from 'bullmq';
import { connection } from '../setup';

// Mock database client (replace with your actual Prisma/TypeORM client)
// import { db } from '@/lib/db';

interface HeatScoreJob {
  dryRun?: boolean; // If true, don't update DB, just return scores
}

/**
 * Heat Score Worker
 *
 * Calculates heat scores based on last 7 days of activity
 * Updates products.heat_score and products.heat_rank
 */
export const heatScoreWorker = new Worker(
  'ai-jobs',
  async (job: Job<HeatScoreJob>) => {
    // Only process heat-score jobs
    if (job.name !== 'calculate-heat-scores') {
      return;
    }

    const { dryRun = false } = job.data;

    console.log(`[Heat Score] Starting calculation (dryRun: ${dryRun})`);

    const startTime = Date.now();

    try {
      // 1. Calculate scores using SQL (most efficient)
      const scores = await calculateHeatScores();

      console.log(`[Heat Score] Calculated scores for ${scores.length} products`);

      // 2. Update database (unless dry run)
      if (!dryRun) {
        await updateProductHeatScores(scores);
        console.log(`[Heat Score] Updated ${scores.length} products in database`);
      }

      // 3. Reset products with no recent activity to score 0
      if (!dryRun) {
        const resetCount = await resetInactiveProducts(scores.map((s) => s.productId));
        console.log(`[Heat Score] Reset ${resetCount} inactive products to score 0`);
      }

      const duration = Date.now() - startTime;

      return {
        status: 'success',
        productsUpdated: scores.length,
        durationMs: duration,
        dryRun,
        topProducts: scores.slice(0, 10), // Top 10 for logging
      };
    } catch (error) {
      console.error(`[Heat Score] Error calculating scores:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 1, // Only run one at a time (heavy query)
  }
);

// Event handlers
heatScoreWorker.on('completed', (job) => {
  console.log(`[Heat Score] Job ${job.id} completed in ${job.returnvalue.durationMs}ms`);
  console.log(`[Heat Score] Top 10 products:`, job.returnvalue.topProducts);
});

heatScoreWorker.on('failed', (job, error) => {
  console.error(`[Heat Score] Job ${job?.id} failed:`, error);
});

/**
 * Calculate heat scores using raw SQL
 * This is the most efficient approach for large datasets
 */
async function calculateHeatScores(): Promise<
  Array<{ productId: string; score: number; rank: number }>
> {
  // TODO: Replace with real database query using your ORM
  // This is the SQL you'd use with Prisma.$queryRaw or similar

  const query = `
    WITH event_scores AS (
      SELECT
        product_id,
        event_type,
        timestamp,
        -- Calculate time decay factor (exponential decay over 7 days)
        EXP(-EXTRACT(EPOCH FROM (NOW() - timestamp)) / 604800.0) as decay_factor,
        -- Event weights
        CASE
          WHEN event_type = 'product_viewed' THEN 1
          WHEN event_type = 'add_to_cart' THEN 5
          WHEN event_type = 'purchase' THEN 10
          WHEN event_type = 'product_shared' THEN 3
          ELSE 0
        END as event_weight
      FROM events.user_events
      WHERE
        product_id IS NOT NULL
        AND timestamp > NOW() - INTERVAL '7 days'
        AND event_type IN ('product_viewed', 'add_to_cart', 'purchase', 'product_shared')
    ),
    product_scores AS (
      SELECT
        product_id,
        SUM(event_weight * decay_factor) as raw_score
      FROM event_scores
      GROUP BY product_id
    ),
    ranked_scores AS (
      SELECT
        product_id,
        raw_score,
        -- Normalize to 0-100 scale
        (raw_score / NULLIF((SELECT MAX(raw_score) FROM product_scores), 0) * 100)::INTEGER as score,
        ROW_NUMBER() OVER (ORDER BY raw_score DESC) as rank
      FROM product_scores
    )
    SELECT
      product_id,
      COALESCE(score, 0) as score,
      rank
    FROM ranked_scores
    ORDER BY score DESC;
  `;

  // Mock implementation (replace with real query)
  console.log('[Heat Score] Executing SQL query...');

  // Example mock data
  return [
    { productId: 'prod_123', score: 95, rank: 1 },
    { productId: 'prod_456', score: 87, rank: 2 },
    { productId: 'prod_789', score: 73, rank: 3 },
  ];
}

/**
 * Update product heat scores in bulk
 */
async function updateProductHeatScores(
  scores: Array<{ productId: string; score: number; rank: number }>
) {
  // TODO: Replace with real bulk update
  // Using Prisma, you might use a transaction with multiple updates
  // or a single SQL UPDATE with a CASE statement

  /*
  const updateQuery = `
    UPDATE core.products p
    SET
      heat_score = c.score,
      heat_rank = c.rank,
      updated_at = NOW()
    FROM (VALUES
      ${scores.map((s) => `('${s.productId}', ${s.score}, ${s.rank})`).join(', ')}
    ) AS c(product_id, score, rank)
    WHERE p.id = c.product_id::uuid;
  `;

  await db.$executeRawUnsafe(updateQuery);
  */

  console.log(`[Heat Score] Would update ${scores.length} products`);
}

/**
 * Reset products with no recent activity to score 0
 */
async function resetInactiveProducts(activeProductIds: string[]): Promise<number> {
  // TODO: Replace with real query

  /*
  const result = await db.product.updateMany({
    where: {
      id: {
        notIn: activeProductIds,
      },
      heat_score: {
        gt: 0,
      },
    },
    data: {
      heat_score: 0,
      heat_rank: null,
    },
  });

  return result.count;
  */

  console.log(`[Heat Score] Would reset inactive products (${activeProductIds.length} active)`);
  return 0;
}

/**
 * Helper: Schedule nightly heat score calculation
 *
 * Call this once when your app starts to set up the recurring job
 *
 * @example
 * import { scheduleNightlyHeatScore } from '@/lib/queue/workers/heat-score';
 *
 * // In your app startup (e.g., instrumentation.ts)
 * await scheduleNightlyHeatScore();
 */
export async function scheduleNightlyHeatScore() {
  const { aiJobsQueue } = await import('../setup');

  // Schedule for 2 AM UTC every day
  await aiJobsQueue.add(
    'calculate-heat-scores',
    {},
    {
      repeat: {
        pattern: '0 2 * * *', // Cron: 2 AM daily
      },
      jobId: 'recurring-heat-score', // Only one recurring job
    }
  );

  console.log('[Heat Score] Scheduled nightly calculation at 2 AM UTC');
}

/**
 * Helper: Trigger heat score calculation on-demand
 *
 * Useful for testing or manual triggers
 *
 * @example
 * await triggerHeatScoreCalculation();
 */
export async function triggerHeatScoreCalculation(dryRun = false) {
  const { aiJobsQueue } = await import('../setup');

  const job = await aiJobsQueue.add('calculate-heat-scores', { dryRun });

  console.log(`[Heat Score] Triggered on-demand calculation (job ${job.id})`);

  return job;
}

export default heatScoreWorker;
