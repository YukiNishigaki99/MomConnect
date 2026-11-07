import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../index.css';
import './../css/Dashboard.css';
import './../css/CreatePost.css';


export default function CreatePost() {
    const navigate = useNavigate();

    const [postType, setPostType] = useState('need_help');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('一時預かり・見守り');
    const [area, setArea] = useState('東京都渋谷区');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        // 本来はここでバックエンド (FastAPI) へ API リクエストを送ります
        alert('投稿が完了しました！');
        navigate('/dashboard');
    };

    return (
        <div className="dashboard-page">
            <nav className="navbar">
                <h2>MomConnect</h2>
                <button onClick={() => navigate('/dashboard')} className="logout-btn">
                    キャンセル
                </button>
            </nav>

            <main className="main-content">
                <div className="card">
                    <h3>新規投稿の作成</h3>
                    <form onSubmit={handleSubmit} className="create-post-form">
                        <div className="form-group">
                            <label>投稿のタイプ</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="postType"
                                        value="need_help"
                                        checked={postType === 'need_help'}
                                        onChange={(e) => setPostType(e.target.value)}
                                    />
                                    🚨 助けてほしい (Need Help)
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="postType"
                                        value="can_help"
                                        checked={postType === 'can_help'}
                                        onChange={(e) => setPostType(e.target.value)}
                                    />
                                    🤝 お手伝いできる (Can Help)
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">タイトル</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="例: 来週の水曜日、1時間ほど見守りをお願いしたいです"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">カテゴリー</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="一時預かり・見守り">一時預かり・見守り</option>
                                <option value="お出かけサポート">お出かけサポート</option>
                                <option value="相談・お下がり">相談・お下がり</option>
                                <option value="家事手伝い">家事手伝い</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="area">対象エリア (市区町村)</label>
                            <input
                                id="area"
                                type="text"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">詳しい内容</label>
                            <textarea
                                id="description"
                                rows="5"
                                placeholder="希望日時や具体的なサポート内容を記入してください"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-btn">
                                投稿する
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}