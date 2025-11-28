import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchCartByUserId, clearCart } from '../slices/CartSlice'
import '../styles/pages/product.css'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Cart, loading } = useAppSelector((state) => state.cart)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }
    const currentUser = JSON.parse(currentUserJson) as { id: string }
    setUserId(currentUser.id)
    
    // Cargar carrito desde la base de datos
    if (currentUser.id) {
      dispatch(fetchCartByUserId(currentUser.id))
    }
  }, [navigate, dispatch])

  // Obtener items del carrito con productos incluidos
  const items = Cart.filter(c => c.product !== undefined)

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = item.product
      return product ? acc + product.price * item.quantity : acc
    }, 0)
  }, [items])

  const formatPrice = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)

  if (userId === null) return null

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="container">
          <p style={{ color: 'var(--text-muted)' }}>Loading checkout...</p>
        </div>
      </div>
    )
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(clearCart(userId)).unwrap()
      alert('Payment processed successfully (simulated). Thank you for your purchase!')
      navigate('/')
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Error processing payment. Please try again.')
    }
  }

  return (
    <div className="product-detail-container">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)', textAlign: 'center', marginBottom: '2rem' }}>Checkout</h1>
        <form
          onSubmit={handlePay}
          style={{
            display: 'grid',
            gap: 18,
            maxWidth: 480,
            width: '100%',
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
          <button type="submit" className="btn-primary" style={{ width: '100%', maxWidth: 240, margin: '0 auto' }}>Pay</button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
