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

