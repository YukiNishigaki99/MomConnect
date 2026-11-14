import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './../css/Dashboard.css';
import './../css/CreatePost.css';

export default function CreatePost() {
    const navigate = useNavigate();

    // Form state management
    const [postType, setPostType] = useState('need_help');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Temporary Childcare / Monitoring');
    const [area, setArea] = useState('Shibuya-ku, Tokyo');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        // Inside handleSubmit in CreatePost.jsx
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const authorName = savedUser?.name || 'Anonymous Mom';

        e.preventDefault();
        if (!title.trim()) {
            alert('Please enter a title.');
            return;
        }

        try {
            // Send POST request to FastAPI backend
            const response = await api.post('/posts/', {
                type: postType,
                title: title,
                category: category,
                area: area,
                description: description,
                author: authorName
            });

            console.log("Post created successfully:", response.data);
            alert('Post created successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create post:", error.response?.data?.detail || error.message);
            alert("Failed to create post. Please try again.");
        }
    };

    return (
        <div className="dashboard-page">
            <nav className="navbar">
                <h2>MomConnect</h2>
                <button onClick={() => navigate('/dashboard')} className="logout-btn">
                    Cancel
                </button>
            </nav>

            <main className="main-content">
                <div className="card">
                    <h3>Create New Post</h3>
                    <form onSubmit={handleSubmit} className="create-post-form">
                        <div className="form-group">
                            <label>Post Type</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="postType"
                                        value="need_help"
                                        checked={postType === 'need_help'}
                                        onChange={(e) => setPostType(e.target.value)}
                                    />
                                    🚨 Need Help
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="postType"
                                        value="can_help"
                                        checked={postType === 'can_help'}
                                        onChange={(e) => setPostType(e.target.value)}
                                    />
                                    🤝 Can Help
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="e.g., Looking for someone to watch my child next Wednesday for an hour"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Temporary Childcare / Monitoring">Temporary Childcare / Monitoring</option>
                                <option value="Outing Support">Outing Support</option>
                                <option value="Advice / Hand-me-downs">Advice / Hand-me-downs</option>
                                <option value="Housework Assistance">Housework Assistance</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="area">Target Area (City / Ward)</label>
                            <input
                                id="area"
                                type="text"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Detailed Description</label>
                            <textarea
                                id="description"
                                rows="5"
                                placeholder="Please enter preferred dates and specific details regarding the support needed"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-btn">
                                Submit Post
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}