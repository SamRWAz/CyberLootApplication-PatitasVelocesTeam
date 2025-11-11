import { useState, useEffect } from 'react'
import type { Comment } from '../models/Comment'
import { 
  getCommentsByProductId, 
  saveCommentToStorage 
} from '../models/Comment'
import '../styles/components/commentList.css'

interface CommentListProps {
  productId: string
}

function CommentList({ productId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [userName, setUserName] = useState('Anonymous User')

  useEffect(() => {
    // Cargar comentarios del producto
    const productComments = getCommentsByProductId(productId)
    setComments(productComments)

    // Intentar obtener el nombre del usuario desde localStorage
    const currentUser = localStorage.getItem('cyberloot_current_user')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        setUserName(user.fullName || user.username || 'User')
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [productId])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      return
    }

    const comment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      userId: localStorage.getItem('cyberloot_current_user_id') || 'anonymous',
      userName,
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    }

    saveCommentToStorage(comment)
    setComments([comment, ...comments])
    setNewComment('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="comment-list-container">
      <h2 className="comments-title">Comments</h2>

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
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <div className="comment-avatar">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-author-info">
                    <span className="comment-author-name">{comment.userName}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
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

