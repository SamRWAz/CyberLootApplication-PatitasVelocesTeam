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
        <h1 style={{ color: '#fff' }}>Checkout</h1>
        <form onSubmit={handlePay} style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Cardholder Name</label>
            <input required type="text" style={{ width: '100%', padding: 10 }} />
          </div>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Card Number</label>
            <input required type="text" inputMode="numeric" pattern="[0-9\\s]{12,19}" placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: 10 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Expiration (MM/YY)</label>
              <input required type="text" placeholder="MM/YY" style={{ width: '100%', padding: 10 }} />
            </div>
            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>CVC</label>
              <input required type="text" inputMode="numeric" pattern="[0-9]{3,4}" placeholder="123" style={{ width: '100%', padding: 10 }} />
            </div>
          </div>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Address</label>
            <input required type="text" style={{ width: '100%', padding: 10 }} />
          </div>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>City</label>
            <input required type="text" style={{ width: '100%', padding: 10 }} />
          </div>
          <div style={{ color: '#fff', fontWeight: 700, marginTop: 8 }}>Total: {formatPrice(total)}</div>
          <button type="submit" className="btn-primary" style={{ width: 240 }}>Pay</button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
