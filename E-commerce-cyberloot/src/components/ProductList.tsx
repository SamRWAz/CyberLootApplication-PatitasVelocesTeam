type ProductCondition = 'new' | 'used' | 'refurbished'

type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  seller: string
}

const products: Product[] = [
  {
    id: 'p-1',
    title: 'Wireless Headphones Pro X',
    description: 'Immersive sound, noise cancellation, and long-lasting battery.',
    price: 89.99,
    image: 'https://picsum.photos/seed/audio-auriculares/800/600',
    seller: 'Brian Moser'
  },
  {
    id: 'p-2',
    title: 'Retro Mini Console',
    description: 'Relive classics with HDMI output and 2 controllers included.',
    price: 129.5,
    image: 'https://picsum.photos/seed/consola-retro/800/600',
    seller: 'Dexter Morgan'
  },
  {
    id: 'p-3',
    title: 'PC Gamer Upgrade Kit',
    description: 'Memory, NVMe SSD, and RGB cooling pack to boost your rig.',
    price: 159.0,
    image: 'https://picsum.photos/seed/pc-upgrade/800/600',
    seller: 'Debra Morgan'
  }
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
}

function ProductList() {
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Featured products</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}
      >
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => console.log(`Clicked product: ${product.id}`)}
            style={{
              border: '1px solid #2a2a2a',
              borderRadius: 0,
              background: '#1D1D1B',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              textAlign: 'left',
              width: '100%',
              padding: 0,
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'
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
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log(`Added to favorites: ${product.id}`)
                }}
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <span style={{ 
                  color: '#ffffff', 
                  fontSize: '16px',
                  userSelect: 'none'
                }}>
                  ♥
                </span>
              </button>
            </div>

            <div style={{ padding: '16px 16px 12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>{product.title}</h3>
              <p style={{ margin: '8px 0 12px', color: '#d1d5db', fontSize: '.95rem', lineHeight: 1.5 }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{formatPrice(product.price)}</span>
              </div>
              <div style={{ 
                borderTop: '1px solid #2a2a2a', 
                paddingTop: '8px',
                marginTop: '8px'
              }}>
                <span style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.85rem',
                  fontStyle: 'italic'
                }}>
                  Vendido por: {product.seller}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ProductList


