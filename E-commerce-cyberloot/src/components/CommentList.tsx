import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../slices/hooks'
import { fetchCommentsByProductId, createComment } from '../slices/CommentSlice'
import '../styles/components/commentList.css'

interface CommentListProps {
  productId: string
}

function CommentList({ productId }: CommentListProps) {
  const dispatch = useAppDispatch()
  const { Comments, loading } = useAppSelector((state) => state.comments)
  const [newComment, setNewComment] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  // Filtrar comentarios del producto actual
  const productComments = Comments.filter(c => c.product_id === productId) as any[]

  useEffect(() => {
    // Cargar comentarios del producto
    dispatch(fetchCommentsByProductId(productId))

    // Intentar obtener el usuario desde localStorage
    const currentUser = localStorage.getItem('cyberloot_current_user')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        setUserId(user.id)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [productId, dispatch])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim() || !userId) {
      alert('Please log in to comment')
      return
    }

    try {
      await dispatch(createComment({
        content: newComment.trim(),
        user_id: userId,
        product_id: productId,
      })).unwrap()
      
      setNewComment('')
      // Recargar comentarios
      dispatch(fetchCommentsByProductId(productId))
    } catch (error: any) {
      console.error('Error al crear comentario:', error)
      alert('Error posting comment. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch {
      return 'Date not available'
    }
  }

  return (
    <div className="comment-list-container">
      <h2 className="comments-title">Comments</h2>

      {userId ? (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <textarea
            className="comment-input"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
          />
          <button 
            type="submit" 
            className="comment-submit-btn"
            disabled={!newComment.trim() || loading}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <a href="/login" style={{ color: 'var(--accent)' }}>Log in</a> to comment
        </p>
      )}

      <div className="comments-list">
        {loading && productComments.length === 0 ? (
          <p className="no-comments">Loading comments...</p>
        ) : productComments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          productComments.map((comment: any) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <div className="comment-avatar">
                    {comment.userPhoto ? (
                      <img 
                        src={comment.userPhoto} 
                        alt={comment.userName}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      (comment.userName || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="comment-author-info">
                    <span className="comment-author-name">{comment.userName || 'Unknown user'}</span>
                    {comment.createdAt && (
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentList
