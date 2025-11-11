import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, clearCart } from '../models/User'
import { getProductById } from '../models/Product'
import '../styles/pages/product.css'

function Checkout() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }
    const currentUser = JSON.parse(currentUserJson) as { id: string }
    setUserId(currentUser.id)
    const cart = getCart(currentUser.id)
    const sum = cart.reduce((acc, it) => {
      const p = getProductById(it.productId)
      return p ? acc + p.price * it.quantity : acc
    }, 0)
    setTotal(sum)
  }, [navigate])

  const formatPrice = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)

  if (userId === null) return null

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Pago procesado exitosamente (simulado). ¡Gracias por tu compra!')
    clearCart(userId)
    navigate('/')
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        <h1 style={{ color: '#fff' }}>Pago</h1>
        <form onSubmit={handlePay} style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Nombre en la tarjeta</label>
            <input required type="text" style={{ width: '100%', padding: 10 }} />
          </div>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Número de tarjeta</label>
            <input required type="text" inputMode="numeric" pattern="[0-9\\s]{12,19}" placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: 10 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Expiración (MM/YY)</label>
              <input required type="text" placeholder="MM/YY" style={{ width: '100%', padding: 10 }} />
            </div>
            <div>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>CVC</label>
              <input required type="text" inputMode="numeric" pattern="[0-9]{3,4}" placeholder="123" style={{ width: '100%', padding: 10 }} />
            </div>
          </div>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Dirección</label>
            <input required type="text" style={{ width: '100%', padding: 10 }} />
          </div>
          <div>
            <label style={{ color: '#9ca3af', display: 'block', marginBottom: 4 }}>Ciudad</label>
            <input required type="text" style={{ width: '100%', padding: 10 }} />
          </div>
          <div style={{ color: '#fff', fontWeight: 700, marginTop: 8 }}>Total: {formatPrice(total)}</div>
          <button type="submit" className="btn-primary" style={{ width: 240 }}>Pagar</button>
        </form>
      </div>
    </div>
  )
}

export default Checkout


