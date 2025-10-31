'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart-store'
import { CartDrawer } from './cart-drawer'

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-body-small font-medium text-foreground transition-colors hover:text-brand-primary"
        aria-label="Shopping cart"
      >
        Cart
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
