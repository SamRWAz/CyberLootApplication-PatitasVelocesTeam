import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchProducts } from '../slices/ProductSlice'
import { getFavorites } from '../models/User'

function Favorites() {
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

  // Obtener productos favoritos desde Redux
  const favIds = userId ? getFavorites(userId) : []
  const favProducts = Products.filter(p => favIds.includes(p.id)) as any[]

  if (userId === null) return null

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>My Favorites</h2>
      {favProducts.length === 0 ? (
        <p style={{ color: '#d1d5db' }}>You don't have any favorite products yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {favProducts.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{
                border: '1px solid #2a2a2a',
                borderRadius: 0,
                background: '#1D1D1B',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                textAlign: 'left',
                textDecoration: 'none',
                display: 'block'
              }}
            >
              <div style={{ position: 'relative', paddingTop: '56%' }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{ padding: '16px 16px 12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>{product.title}</h3>
                <p style={{ margin: '8px 0 12px', color: '#d1d5db', fontSize: '.95rem', lineHeight: 1.5 }}>
                  {product.description}
                </p>
                <div style={{ color: '#fff', fontWeight: 700 }}>
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(product.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default Favorites
