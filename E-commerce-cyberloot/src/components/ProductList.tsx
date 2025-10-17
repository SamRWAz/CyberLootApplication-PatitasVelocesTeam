type ProductCondition = 'new' | 'used' | 'refurbished'

type Product = {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: ProductCondition
  image: string
}

const products: Product[] = [
  {
    id: 'p-1',
    title: 'Wireless Headphones Pro X',
    description: 'Immersive sound, noise cancellation, and long-lasting battery.',
    price: 89.99,
    category: 'Audio',
    condition: 'new',
    image: 'https://picsum.photos/seed/audio-auriculares/800/600'
  },
  {
    id: 'p-2',
    title: 'Retro Mini Console',
    description: 'Relive classics with HDMI output and 2 controllers included.',
    price: 129.5,
    category: 'Consoles',
    condition: 'refurbished',
    image: 'https://picsum.photos/seed/consola-retro/800/600'
  },
  {
    id: 'p-3',
    title: 'PC Gamer Upgrade Kit',
    description: 'Memory, NVMe SSD, and RGB cooling pack to boost your rig.',
    price: 159.0,
    category: 'Components',
    condition: 'new',
    image: 'https://picsum.photos/seed/pc-upgrade/800/600'
  },
  {
    id: 'p-4',
    title: 'Video Game Deluxe Edition',
    description: 'Includes extra content and digital soundtrack.',
    price: 59.99,
    category: 'Video games',
    condition: 'used',
    image: 'https://picsum.photos/seed/videojuego-deluxe/800/600'
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
          <article
            key={product.id}
            style={{
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              background: '#1D1D1B',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{formatPrice(product.price)}</span>
                <span style={{ color: '#d1d5db' }}>|</span>
                <span style={{ color: '#d1d5db' }}>{product.category}</span>
                <span style={{ color: '#d1d5db' }}>
                  {product.condition === 'new' && 'New'}
                  {product.condition === 'used' && 'Used'}
                  {product.condition === 'refurbished' && 'Refurbished'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProductList


