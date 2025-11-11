export type ProductCondition = 'new' | 'used' | 'refurbished'

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  seller: string
  sellerId?: string // ID del usuario vendedor
  category: 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components'
  condition: ProductCondition // Estado del producto
}

// Función para guardar producto en localStorage
export function saveProductToStorage(product: Product): void {
  const products = getProductsFromStorage()
  products.push(product)
  localStorage.setItem('cyberloot_products', JSON.stringify(products))
}

// Función para actualizar un producto en localStorage
export function updateProductInStorage(updated: Product): void {
  const products = getProductsFromStorage()
  const index = products.findIndex(p => p.id === updated.id)
  if (index !== -1) {
    products[index] = updated
    localStorage.setItem('cyberloot_products', JSON.stringify(products))
  }
}

// Función para eliminar un producto en localStorage
export function deleteProductFromStorage(productId: string): void {
  const products = getProductsFromStorage().filter(p => p.id !== productId)
  localStorage.setItem('cyberloot_products', JSON.stringify(products))
}

// Función para obtener productos de localStorage
export function getProductsFromStorage(): Product[] {
  const productsJson = localStorage.getItem('cyberloot_products')
  return productsJson ? JSON.parse(productsJson) : []
}

// Función para obtener un producto por ID
export function getProductById(id: string): Product | undefined {
  const products = getProductsFromStorage()
  return products.find(product => product.id === id)
}

// Función para obtener productos por sellerId
export function getProductsBySellerId(sellerId: string): Product[] {
  const products = getProductsFromStorage()
  return products.filter(product => product.sellerId === sellerId)
}

// Función para obtener productos por IDs
export function getProductsByIds(ids: string[]): Product[] {
  const products = getProductsFromStorage()
  return products.filter(product => ids.includes(product.id))
}

