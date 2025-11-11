import { Link } from 'react-router-dom'
import type { Product } from '../models/Product'

export const products: Product[] = [
  {
    id: 'p-1',
    title: 'Wireless Headphones Pro X',
    description: 'Immersive sound, noise cancellation, and long-lasting battery.',
    price: 89.99,
    image: 'https://picsum.photos/seed/audio-auriculares/800/600',
    seller: 'Brian Moser',
    category: 'accesories',
    condition: 'new'
  },
  {
    id: 'p-2',
    title: 'Retro Mini Console',
    description: 'Relive classics with HDMI output and 2 controllers included.',
    price: 129.5,
    image: 'https://picsum.photos/seed/consola-retro/800/600',
    seller: 'Dexter Morgan',
    category: 'consoles',
    condition: 'used'
  },
  {
    id: 'p-3',
    title: 'PC Gamer Upgrade Kit',
    description: 'Memory, NVMe SSD, and RGB cooling pack to boost your rig.',
    price: 159.0,
    image: 'https://picsum.photos/seed/pc-upgrade/800/600',
    seller: 'Debra Morgan',
    category: 'components',
    condition: 'new'
  },
  {
    id: 'p-4',
    title: 'Cyberpunk 2077 - Collector\'s Edition',
    description: 'Complete edition with steelbook, artbook, and exclusive figurine.',
    price: 149.99,
    image: 'https://picsum.photos/seed/cyberpunk-game/800/600',
    seller: 'Rita Bennett',
    category: 'videogames',
    condition: 'new'
  },
  {
    id: 'p-5',
    title: 'PlayStation 5 Console',
    description: 'Next-gen gaming console with 4K gaming and ray tracing support.',
    price: 499.99,
    image: 'https://picsum.photos/seed/ps5-console/800/600',
    seller: 'James Doakes',
    category: 'consoles',
    condition: 'refurbished'
  },
  {
    id: 'p-6',
    title: 'Gaming Mechanical Keyboard RGB',
    description: 'Mechanical switches, customizable RGB lighting, and wrist rest included.',
    price: 129.99,
    image: 'https://picsum.photos/seed/keyboard-gaming/800/600',
    seller: 'Maria LaGuerta',
    category: 'accesories',
    condition: 'new'
  },
  {
    id: 'p-7',
    title: 'Official Gaming T-Shirt Collection',
    description: 'Premium cotton t-shirts with your favorite game characters.',
    price: 29.99,
    image: 'https://picsum.photos/seed/gaming-tshirt/800/600',
    seller: 'Angel Batista',
    category: 'merchandising',
    condition: 'new'
  },
  {
    id: 'p-8',
    title: 'NVIDIA RTX 4080 Graphics Card',
    description: 'High-performance GPU with 16GB VRAM for 4K gaming and streaming.',
    price: 1199.99,
    image: 'https://picsum.photos/seed/rtx4080/800/600',
    seller: 'Vince Masuka',
    category: 'components',
    condition: 'used'
  },
  {
    id: 'p-9',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'Latest adventure in the Zelda series for Nintendo Switch.',
    price: 59.99,
    image: 'https://picsum.photos/seed/zelda-game/800/600',
    seller: 'Lila Tournay',
    category: 'videogames',
    condition: 'new'
  },
  {
    id: 'p-10',
    title: 'Xbox Series X Controller',
    description: 'Wireless controller with textured grips and improved ergonomics.',
    price: 69.99,
    image: 'https://picsum.photos/seed/xbox-controller/800/600',
    seller: 'Paul Bennett',
    category: 'accesories',
    condition: 'new'
  },
  {
    id: 'p-11',
    title: 'Gaming Mouse Pad XL',
    description: 'Large RGB mouse pad with smooth surface and customizable lighting.',
    price: 39.99,
    image: 'https://picsum.photos/seed/mousepad/800/600',
    seller: 'Frank Lundy',
    category: 'accesories',
    condition: 'new'
  },
  {
    id: 'p-12',
    title: 'Elden Ring - Deluxe Edition',
    description: 'Action RPG masterpiece with exclusive digital content and soundtrack.',
    price: 79.99,
    image: 'https://picsum.photos/seed/elden-ring/800/600',
    seller: 'Miguel Prado',
    category: 'videogames',
    condition: 'used'
  },
  {
    id: 'p-13',
    title: 'Nintendo Switch OLED Model',
    description: 'Enhanced Switch with vibrant OLED screen and improved audio.',
    price: 349.99,
    image: 'https://picsum.photos/seed/switch-oled/800/600',
    seller: 'Anton Briggs',
    category: 'consoles',
    condition: 'refurbished'
  }
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
}

interface ProductListProps {
  category?: 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components'
  title?: string
}

function ProductList({ category, title = 'Featured products' }: ProductListProps) {
  const filteredProducts = category 
    ? products.filter(product => product.category === category)
    : products

  if (filteredProducts.length === 0) {
    return (
      <section className="container" style={{ padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#d1d5db', textAlign: 'center', padding: '2rem' }}>
          No hay productos disponibles en esta categoría.
        </p>
      </section>
    )
  }

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}
      >
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
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
              position: 'relative',
              textDecoration: 'none',
              display: 'block'
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
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProductList


