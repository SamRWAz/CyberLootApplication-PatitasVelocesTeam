import { useEffect, useState, type MouseEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchFavoritesByUserId } from '../slices/FavoriteSlice'

function Favorites() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { Favorites, loading } = useAppSelector((state) => state.favorites)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const currentUserJson = localStorage.getItem('cyberloot_current_user')
    if (!currentUserJson) {
      navigate('/login')
      return
    }
    const currentUser = JSON.parse(currentUserJson) as { id: string }
    setUserId(currentUser.id)
    
    // Cargar favoritos desde la base de datos
    if (currentUser.id) {
      dispatch(fetchFavoritesByUserId(currentUser.id))
    }
  }, [navigate, dispatch])

  // Obtener productos favoritos con datos del producto incluidos
  const favProducts = Favorites.filter(f => f.product !== undefined).map(f => f.product) as any[]

  if (userId === null) return null

  if (loading) {
    return (
      <section className="container" style={{ padding: '2.5rem 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading favorites...</p>
      </section>
    )
  }

  return (
    <section className="container" style={{ padding: '2.5rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>My Favorites</h2>
      {favProducts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>You don't have any favorite products yet.</p>
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
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-strong)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)',
                textAlign: 'left',
                textDecoration: 'none',
                display: 'block',
                transition: 'transform 0.2s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-soft)'
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
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{product.title}</h3>
                <p style={{ margin: '8px 0 12px', color: 'var(--text-muted)', fontSize: '.95rem', lineHeight: 1.5 }}>
                  {product.description}
                </p>
                <div style={{ color: 'var(--accent)', fontWeight: 700 }}>
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
