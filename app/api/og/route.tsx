/**
 * Dynamic OG Image Generator - "The Free Billboard"
 *
 * Every product share becomes a dynamic ad with:
 * - Product image
 * - Price
 * - Stock status (urgency)
 * - Brand
 *
 * Expected impact: +30% CTR on social shares
 *
 * Usage:
 * <meta property="og:image" content="/api/og?title=Saree&price=8500&img=...&stock=Only 3 left" />
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get('title') || 'Handcrafted with Love';
    const price = searchParams.get('price') || '';
    const image = searchParams.get('img') || '';
    const stock = searchParams.get('stock') || ''; // "Only 3 left", "Drops in 2 hours", "Limited Edition"
    const artForm = searchParams.get('artForm') || '';

    // Determine urgency color
    const isUrgent = stock.toLowerCase().includes('only') || stock.toLowerCase().includes('last');
    const urgencyColor = isUrgent ? '#e53e3e' : '#f6ad55';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #F5F5F0 0%, #E8E8E0 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Left Panel: Text Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 60,
              justifyContent: 'center',
              width: '60%',
            }}
          >
            {/* Brand */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#1a1a1a',
                marginBottom: 20,
              }}
            >
              NATI
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: 20,
                color: '#666',
                marginBottom: 40,
                fontStyle: 'italic',
              }}
            >
              Crafted Stories, Woven Traditions
            </div>

            {/* Product Title */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* Art Form Badge (if provided) */}
            {artForm && (
              <div
                style={{
                  display: 'inline-flex',
                  background: '#4a5568',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: 20,
                  fontSize: 20,
                  marginBottom: 20,
                  width: 'fit-content',
                }}
              >
                {artForm}
              </div>
            )}

            {/* Price */}
            {price && (
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: 30,
                }}
              >
                ₹{parseInt(price).toLocaleString('en-IN')}
              </div>
            )}

            {/* Stock Status (Urgency Badge) */}
            {stock && (
              <div
                style={{
                  display: 'inline-flex',
                  background: urgencyColor,
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: 24,
                  fontSize: 24,
                  fontWeight: 'bold',
                  width: 'fit-content',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                }}
              >
                {stock}
              </div>
            )}
          </div>

          {/* Right Panel: Product Image */}
          {image ? (
            <div
              style={{
                width: '40%',
                height: '100%',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={image}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              {/* Overlay gradient for better text contrast */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(245,245,240,0.3) 0%, rgba(0,0,0,0) 100%)',
                }}
              />
            </div>
          ) : (
            // Fallback pattern if no image
            <div
              style={{
                width: '40%',
                height: '100%',
                background: 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 120,
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                ✺
              </div>
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630, // Standard OG image size
      }
    );
  } catch (error) {
    console.error('[OG Image] Error generating image:', error);

    // Return fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: '#F5F5F0',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 900,
            color: '#1a1a1a',
          }}
        >
          NATI
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

/**
 * Helper: Generate OG image URL for a product
 *
 * Use this in your product page's generateMetadata function
 *
 * @example
 * import { generateOGImageUrl } from '@/app/api/og/route';
 *
 * export async function generateMetadata({ params }) {
 *   const product = await getProduct(params.slug);
 *
 *   return {
 *     openGraph: {
 *       images: [generateOGImageUrl(product)],
 *     },
 *   };
 * }
 */
export function generateOGImageUrl(product: {
  name: string;
  price: number;
  thumbnail: string;
  stock?: number;
  artForm?: string;
}): string {
  const params = new URLSearchParams({
    title: product.name,
    price: product.price.toString(),
    img: product.thumbnail,
  });

  // Add stock urgency message
  if (product.stock !== undefined) {
    if (product.stock === 0) {
      params.set('stock', 'Sold Out');
    } else if (product.stock <= 3) {
      params.set('stock', `Only ${product.stock} left`);
    } else if (product.stock <= 10) {
      params.set('stock', 'Low Stock');
    }
  }

  // Add art form if available
  if (product.artForm) {
    params.set('artForm', product.artForm);
  }

  return `/api/og?${params.toString()}`;
}
