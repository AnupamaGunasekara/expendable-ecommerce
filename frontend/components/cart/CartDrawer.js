'use client';

import { useCartStore } from '@/lib/store';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { cartAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { cart, total, isOpen, closeCart, setCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data.cart, response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await cartAPI.update(itemId, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      await cartAPI.remove(itemId);
      await fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Shopping Cart ({cart.items?.length || 0})</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart.items || cart.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link href="/shop" onClick={closeCart} className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{item.product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.variant.size} / {item.variant.color}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <p className="font-medium text-sm">
                      {formatPrice(item.product.salePrice || item.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items?.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {total < 9999 && (
              <p className="text-sm text-gray-600">
                Add {formatPrice(9999 - total)} more for FREE SHIPPING
              </p>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full btn btn-primary text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full btn btn-secondary text-center"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
