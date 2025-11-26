export type Comment = {
  id: string
  content: string
  user_id: string // FK a User.id
  product_id: string // FK a Product.id
}

// Tipo para cuando se obtiene con JOIN (incluye datos del usuario)
export type CommentWithUser = Comment & {
  User?: {
    id: string
    username: string
    fullName: string
    photo: string | null
  }
}
