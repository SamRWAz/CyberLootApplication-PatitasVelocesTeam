import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, updateCartItem, removeFromCart, type CartItem } from '../models/User'
import { getProductById } from '../models/Product'
import type { Product } from '../models/Product'
import '../styles/pages/product.css'

function Cart() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [productsMap, setProductsMap] = useState<Record<string, Product | undefined>>({})

  useEffect(() => {
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }
    const currentUser = JSON.parse(currentUserJson) as { id: string }
    setUserId(currentUser.id)
    const cart = getCart(currentUser.id)
    setItems(cart)
    const map: Record<string, Product | undefined> = {}
    cart.forEach(ci => { map[ci.productId] = getProductById(ci.productId) })
    setProductsMap(map)
  }, [navigate])

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = productsMap[it.productId]
      return p ? sum + p.price * it.quantity : sum
    }, 0)
  }, [items, productsMap])

  const formatPrice = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)

  const handleQtyChange = (productId: string, qty: number) => {
    if (!userId) return
    const next = updateCartItem(userId, productId, qty)
    setItems(next)
  }

  const handleRemove = (productId: string) => {
    if (!userId) return
    const next = removeFromCart(userId, productId)
    setItems(next)
  }

  if (userId === null) return null

  return (
    <div className="product-detail-container">
      <div className="container">
        <h1 style={{ color: '#fff' }}>Mi carrito</h1>
        {items.length === 0 ? (
          <p style={{ color: '#d1d5db' }}>Tu carrito está vacío.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map(ci => {
                const p = productsMap[ci.productId]
                if (!p) return null
                return (
                  <div key={ci.productId} style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 12, alignItems: 'center', background: '#1D1D1B', padding: 12, borderRadius: 8 }}>
                    <img src={p.image} alt={p.title} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 6 }} />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{p.title}</div>
                      <div style={{ color: '#9ca3af', fontSize: 14 }}>{formatPrice(p.price)}</div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => handleQtyChange(p.id, Math.max(1, ci.quantity - 1))} className="btn-secondary">-</button>
                        <span style={{ color: '#fff', minWidth: 24, textAlign: 'center' }}>{ci.quantity}</span>
                        <button onClick={() => handleQtyChange(p.id, ci.quantity + 1)} className="btn-secondary">+</button>
                        <button onClick={() => handleRemove(p.id)} className="btn-delete-account" style={{ marginLeft: 12 }}>Quitar</button>
                      </div>
                    </div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{formatPrice(p.price * ci.quantity)}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ background: '#1D1D1B', padding: 16, borderRadius: 8, height: 'fit-content' }}>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Resumen</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
                Continue to payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart


