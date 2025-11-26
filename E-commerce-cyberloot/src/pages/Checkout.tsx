import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchProducts } from '../slices/ProductSlice'
import { getCart, clearCart } from '../models/User'
import '../styles/pages/product.css'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Products } = useAppSelector((state) => state.products)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Cargar productos si no están cargados
    if (Products.length === 0) {
      dispatch(fetchProducts())
    }

    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }
    const currentUser = JSON.parse(currentUserJson) as { id: string }
    setUserId(currentUser.id)
  }, [navigate, dispatch, Products.length])

  const cart = userId ? getCart(userId) : []
  const total = useMemo(() => {
    return cart.reduce((acc, it) => {
      const p = Products.find(prod => prod.id === it.productId) as any
      return p ? acc + p.price * it.quantity : acc
    }, 0)
  }, [cart, Products])

  const formatPrice = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)

  if (userId === null) return null

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Payment processed successfully (simulated). Thank you for your purchase!')
    clearCart(userId)
    navigate('/')
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        <h1 style={{ color: 'var(--text-primary)' }}>Checkout</h1>
        <form
          onSubmit={handlePay}
          style={{
            display: 'grid',
            gap: 18,
            maxWidth: 480,
            background: 'var(--surface-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: 'var(--glass-border)',
            boxShadow: 'var(--shadow-soft)'
          }}
        >
          <div>
            <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Cardholder Name</label>
            <input required type="text" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Card Number</label>
            <input required type="text" inputMode="numeric" pattern="[0-9\\s]{12,19}" placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Expiration (MM/YY)</label>
              <input required type="text" placeholder="MM/YY" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>CVC</label>
              <input required type="text" inputMode="numeric" pattern="[0-9]{3,4}" placeholder="123" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Address</label>
            <input required type="text" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>City</label>
            <input required type="text" style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ color: 'var(--accent)', fontWeight: 700, marginTop: 8, fontSize: '1.1rem' }}>Total: {formatPrice(total)}</div>
          <button type="submit" className="btn-primary" style={{ width: 240 }}>Pay</button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
