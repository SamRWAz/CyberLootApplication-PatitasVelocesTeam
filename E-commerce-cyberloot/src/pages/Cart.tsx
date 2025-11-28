import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchCartByUserId, updateCartItem, removeFromCart } from '../slices/CartSlice'
import '../styles/pages/product.css'

function Cart() {
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

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = item.product
      return product ? sum + product.price * item.quantity : sum
    }, 0)
  }, [items])

  const formatPrice = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)

  const handleQtyChange = async (cartId: string, qty: number) => {
    if (!userId || qty <= 0) return
    try {
      await dispatch(updateCartItem({ id: cartId, quantity: qty })).unwrap()
      // Recargar el carrito
      dispatch(fetchCartByUserId(userId))
    } catch (error) {
      console.error('Error updating cart item:', error)
      alert('Error updating quantity. Please try again.')
    }
  }

  const handleRemove = async (cartId: string) => {
    if (!userId) return
    try {
      await dispatch(removeFromCart(cartId)).unwrap()
      // Recargar el carrito
      dispatch(fetchCartByUserId(userId))
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert('Error removing item. Please try again.')
    }
  }

  if (userId === null) return null

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="container">
          <p style={{ color: 'var(--text-muted)' }}>Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        <h1 style={{ color: 'var(--text-primary)' }}>My Cart</h1>
        {items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map(item => {
                const product = item.product
                if (!product) return null
                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 12, alignItems: 'center', background: 'var(--surface-strong)', padding: 12, borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', boxShadow: 'var(--shadow-soft)' }}>
                    <img src={product.image} alt={product.title} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 6 }} />
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{formatPrice(product.price)}</div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => handleQtyChange(item.id, Math.max(1, item.quantity - 1))} className="btn-secondary">-</button>
                        <span style={{ color: 'var(--text-primary)', minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item.id, item.quantity + 1)} className="btn-secondary">+</button>
                        <button onClick={() => handleRemove(item.id)} className="btn-delete-account" style={{ marginLeft: 12 }}>Remove</button>
                      </div>
                    </div>
                    <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatPrice(product.price * item.quantity)}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ background: 'var(--surface-strong)', padding: 20, borderRadius: 'var(--radius-md)', height: 'fit-content', border: 'var(--glass-border)', boxShadow: 'var(--shadow-soft)' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>Summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
