export type User = {
  id: string
  username: string
  email: string
  fullName: string
  photo: string | null
  phone: string
  address: string
  location: string
}

export type CartItem = {
  productId: string
  quantity: number
}

// Funciones para manejar carrito y favoritos (siguen usando localStorage por ahora)
// ---------- Favoritos por usuario ----------
function favoritesKey(userId: string) { return `cyberloot_favorites_${userId}` }

export function getFavorites(userId: string): string[] {
  const json = localStorage.getItem(favoritesKey(userId))
  return json ? JSON.parse(json) : []
}

export function toggleFavorite(userId: string, productId: string): string[] {
  const current = getFavorites(userId)
  const exists = current.includes(productId)
  const next = exists ? current.filter(id => id !== productId) : [...current, productId]
  localStorage.setItem(favoritesKey(userId), JSON.stringify(next))
  return next
}

// ---------- Carrito por usuario ----------
function cartKey(userId: string) { return `cyberloot_cart_${userId}` }

export function getCart(userId: string): CartItem[] {
  const json = localStorage.getItem(cartKey(userId))
  return json ? JSON.parse(json) : []
}

export function addToCart(userId: string, productId: string, quantity: number = 1): CartItem[] {
  const cart = getCart(userId)
  const index = cart.findIndex(ci => ci.productId === productId)
  if (index === -1) {
    cart.push({ productId, quantity })
  } else {
    cart[index] = { ...cart[index], quantity: cart[index].quantity + quantity }
  }
  localStorage.setItem(cartKey(userId), JSON.stringify(cart))
  return cart
}

export function updateCartItem(userId: string, productId: string, quantity: number): CartItem[] {
  let cart = getCart(userId)
  cart = cart
    .map(ci => ci.productId === productId ? { ...ci, quantity } : ci)
    .filter(ci => ci.quantity > 0)
  localStorage.setItem(cartKey(userId), JSON.stringify(cart))
  return cart
}

export function removeFromCart(userId: string, productId: string): CartItem[] {
  const cart = getCart(userId).filter(ci => ci.productId !== productId)
  localStorage.setItem(cartKey(userId), JSON.stringify(cart))
  return cart
}

export function clearCart(userId: string): void {
  localStorage.removeItem(cartKey(userId))
}
