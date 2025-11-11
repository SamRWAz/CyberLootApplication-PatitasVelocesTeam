import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getFavorites } from '../models/User'
import { getProductById } from '../models/Product'
import type { Product } from '../models/Product'

function Favorites() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [favProducts, setFavProducts] = useState<Product[]>([])

  useEffect(() => {
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }
    const currentUser = JSON.parse(currentUserJson) as { id: string }
    setUserId(currentUser.id)
    const favIds = getFavorites(currentUser.id)
    const products = favIds.map(id => getProductById(id)).filter(Boolean) as Product[]
    setFavProducts(products)
  }, [navigate])

  if (userId === null) return null

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Mis favoritos</h2>
      {favProducts.length === 0 ? (
        <p style={{ color: '#d1d5db' }}>No tienes productos favoritos aún.</p>
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default Favorites


