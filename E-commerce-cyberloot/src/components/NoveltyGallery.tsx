import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchProducts } from '../slices/ProductSlice'
import '../styles/components/noveltyGallery.css'

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
}

function NoveltyGallery() {
  const dispatch = useAppDispatch()
  const { Products } = useAppSelector((state) => state.products)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (Products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, Products.length])

  const featuredProducts = useMemo(() => {
    if (Products.length === 0) {
      return []
    }
    return Products.slice(0, 8)
  }, [Products])

  useEffect(() => {
    if (featuredProducts.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredProducts])

  if (featuredProducts.length === 0) {
    return null
  }

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % featuredProducts.length)
  }

  return (
    <section className="novelty-gallery">
      <div className="container">
        <div className="novelty-header">
          <p className="novelty-kicker">Fresh drops</p>
          <h2>Discover what's trending</h2>
          <p className="novelty-description">
            Quick glances at the most popular listings of the day. Swipe through and grab them before they are gone.
          </p>
        </div>

        <div className="novelty-carousel">
          <button type="button" className="novelty-arrow left" aria-label="Previous" onClick={goPrev}>
            ←
          </button>
          <div
            className="novelty-track"
            style={{
              transform: `translateX(-${current * 100}%)`
            }}
          >
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="novelty-card">
                <div className="novelty-image">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="novelty-info">
                  <span className="novelty-category">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p className="novelty-price">{formatPrice(product.price)}</p>
                  <p className="novelty-condition">{product.condition}</p>
                </div>
              </Link>
            ))}
          </div>
          <button type="button" className="novelty-arrow right" aria-label="Next" onClick={goNext}>
            →
          </button>
        </div>

        <div className="novelty-dots">
          {featuredProducts.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={index === current ? 'active' : ''}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NoveltyGallery


