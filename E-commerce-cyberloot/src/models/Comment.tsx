export type Comment = {
  id: string
  productId: string
  userId: string
  userName: string
  userPhoto?: string
  content: string
  createdAt: string
}

// Función para guardar comentario en localStorage
export function saveCommentToStorage(comment: Comment): void {
  const comments = getCommentsFromStorage()
  comments.push(comment)
  localStorage.setItem('cyberloot_comments', JSON.stringify(comments))
}

// Función para obtener comentarios de localStorage
export function getCommentsFromStorage(): Comment[] {
  const commentsJson = localStorage.getItem('cyberloot_comments')
  return commentsJson ? JSON.parse(commentsJson) : []
}

// Función para obtener comentarios por productId
export function getCommentsByProductId(productId: string): Comment[] {
  const comments = getCommentsFromStorage()
  return comments
    .filter(comment => comment.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Función para eliminar un comentario
export function deleteCommentFromStorage(commentId: string): void {
  const comments = getCommentsFromStorage()
  const filteredComments = comments.filter(comment => comment.id !== commentId)
  localStorage.setItem('cyberloot_comments', JSON.stringify(filteredComments))
}

// Función para generar comentarios de ejemplo
export function generateSampleComments(): void {
  const existingComments = getCommentsFromStorage()
  
  // Si ya hay comentarios, no generar más
  if (existingComments.length > 0) {
    return
  }

  const sampleComments: Comment[] = [
    // Comentarios para Wireless Headphones Pro X (p-1)
    {
      id: 'comment-1',
      productId: 'p-1',
      userId: 'user-sample-1',
      userName: 'Alex Johnson',
      content: 'Amazing headphones! The noise cancellation is incredible and the battery lasts all day. Highly recommend!',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      id: 'comment-2',
      productId: 'p-1',
      userId: 'user-sample-2',
      userName: 'Sarah Martinez',
      content: 'Great sound quality and very comfortable to wear. The only downside is they\'re a bit heavy after long sessions.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      id: 'comment-3',
      productId: 'p-1',
      userId: 'user-sample-3',
      userName: 'Mike Chen',
      content: 'Perfect for work calls and music. The build quality feels premium. Worth every penny!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    
    // Comentarios para Retro Mini Console (p-2)
    {
      id: 'comment-4',
      productId: 'p-2',
      userId: 'user-sample-4',
      userName: 'Emma Wilson',
      content: 'Brings back so many memories! Works perfectly and the controllers are in great condition. Seller was very responsive.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    },
    {
      id: 'comment-5',
      productId: 'p-2',
      userId: 'user-sample-5',
      userName: 'David Brown',
      content: 'Great retro gaming experience. HDMI output works flawlessly. The console shows some wear but functions perfectly.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    },
    
    // Comentarios para PlayStation 5 Console (p-5)
    {
      id: 'comment-6',
      productId: 'p-5',
      userId: 'user-sample-6',
      userName: 'Jessica Taylor',
      content: 'Excellent condition! Looks almost brand new. Fast shipping and well packaged. Very satisfied with the purchase.',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
    },
    {
      id: 'comment-7',
      productId: 'p-5',
      userId: 'user-sample-7',
      userName: 'Robert Anderson',
      content: 'Refurbished but works like new. All features working perfectly. Great price for a PS5!',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'comment-8',
      productId: 'p-5',
      userId: 'user-sample-8',
      userName: 'Lisa Garcia',
      content: 'Amazing console! The 4K gaming is stunning. Seller was professional and answered all my questions quickly.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    
    // Comentarios para Cyberpunk 2077 Collector's Edition (p-4)
    {
      id: 'comment-9',
      productId: 'p-4',
      userId: 'user-sample-9',
      userName: 'James Miller',
      content: 'Beautiful collector\'s edition! The steelbook and artbook are amazing quality. The figurine is a great addition to my collection.',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
    },
    {
      id: 'comment-10',
      productId: 'p-4',
      userId: 'user-sample-10',
      userName: 'Amanda White',
      content: 'Perfect for collectors! Everything is in mint condition. The exclusive content makes it worth the price.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    
    // Comentarios para NVIDIA RTX 4080 (p-8)
    {
      id: 'comment-11',
      productId: 'p-8',
      userId: 'user-sample-11',
      userName: 'Chris Thompson',
      content: 'Incredible performance! Handles 4K gaming like a champ. Used but works perfectly. Great deal!',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() // 9 days ago
    },
    {
      id: 'comment-12',
      productId: 'p-8',
      userId: 'user-sample-12',
      userName: 'Nicole Lee',
      content: 'Upgraded from a 3070 and the difference is night and day. Streaming and gaming at the same time is no problem now.',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
    },
    
    // Comentarios para Nintendo Switch OLED (p-13)
    {
      id: 'comment-13',
      productId: 'p-13',
      userId: 'user-sample-13',
      userName: 'Kevin Rodriguez',
      content: 'OLED screen is gorgeous! Much better than the original Switch. Refurbished but looks brand new.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    },
    {
      id: 'comment-14',
      productId: 'p-13',
      userId: 'user-sample-14',
      userName: 'Michelle Kim',
      content: 'Perfect for portable gaming. The improved audio is noticeable. Great purchase for my daily commute!',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    }
  ]

  // Guardar todos los comentarios
  localStorage.setItem('cyberloot_comments', JSON.stringify(sampleComments))
}

