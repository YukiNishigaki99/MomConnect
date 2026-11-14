import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './../css/Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ name: 'Guest User' });
    const [posts, setPosts] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);

    // Track comment text input per post id: { [postId]: "comment text" }
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts/');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentInputs(prev => ({ ...prev, [postId]: text }));
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;

        try {
            await api.post(`/posts/${postId}/comments`, {
                text: text.trim(),
                author: user.name || 'Anonymous Mom'
            });

            // Clear input and refresh posts
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const filteredPosts = posts.filter((post) => {
        if (filterType === 'all') return true;
        return post.type === filterType;
    });

    return (
        <div className="dashboard-page">
            <nav className="navbar">
                <h2>MotherConnect</h2>
                <div className="nav-actions">
                    <span className="welcome-text">Welcome, {user.name}</span>
                    <button onClick={() => navigate('/create-post')} className="primary-btn">
                        + Create Post
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <div className="filter-bar">
                    <button
                        className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        All Posts
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'need_help' ? 'active' : ''}`}
                        onClick={() => setFilterType('need_help')}
                    >
                        🚨 Need Help
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'can_help' ? 'active' : ''}`}
                        onClick={() => setFilterType('can_help')}
                    >
                        🤝 Can Help
                    </button>
                </div>

                {loading ? (
                    <p>Loading posts...</p>
                ) : filteredPosts.length === 0 ? (
                    <div className="empty-state">
                        <p>No posts found. Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className={`post-card ${post.type}`}>
                                <div className="post-header">
                                    <span className={`badge ${post.type}`}>
                                        {post.type === 'need_help' ? '🚨 Need Help' : '🤝 Can Help'}
                                    </span>
                                    <span className="category-tag">{post.category}</span>
                                </div>

                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-area">📍 {post.area}</p>
                                <p className="post-description">{post.description}</p>

                                <div className="post-footer">
                                    <span className="post-author">Posted by: {post.author}</span>
                                </div>

                                {/* Comments Section */}
                                <div className="comments-section">
                                    <h4>Comments ({post.comments?.length || 0})</h4>
                                    <div className="comments-list">
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map((comment, index) => (
                                                <div key={index} className="comment-item">
                                                    <strong>{comment.author}: </strong>
                                                    <span>{comment.text}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-comments">No comments yet. Start the conversation!</p>
                                        )}
                                    </div>

                                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={commentInputs[post.id] || ''}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="comment-submit-btn">Post</button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}