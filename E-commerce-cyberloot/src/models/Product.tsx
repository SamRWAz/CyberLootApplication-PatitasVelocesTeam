export type ProductCondition = 'new' | 'used' | 'refurbished'

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  user_id: string // FK a User.id
  category: 'videogames' | 'consoles' | 'accesories' | 'merchandising' | 'components'
  condition: ProductCondition
}

// Tipos para cuando se obtiene con JOIN (incluye datos del vendedor)
export type ProductWithSeller = Product & {
  User?: {
    id: string
    username: string
    fullName: string
    photo: string | null
  }
}
