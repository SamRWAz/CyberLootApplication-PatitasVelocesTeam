export type Favorite = {
  id: string
  user_id: string // FK a User.id
  product_id: string // FK a Product.id
}

// Tipo para cuando se obtiene con JOIN (incluye datos del producto)
export type FavoriteWithProduct = Favorite & {
  Product?: {
    id: string
    title: string
    description: string
    price: number
    image: string
    category: 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components'
    condition: 'new' | 'used' | 'refurbished'
  }
}

