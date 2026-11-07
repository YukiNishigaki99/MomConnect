import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../index.css';
import './../css/Dashboard.css';


export default function Dashboard() {
    const navigate = useNavigate();

    // ユーザーのモックデータ
    const user = {
        name: '山田 花子',
        role: 'requester', // 'requester' または 'supporter'
        area: '東京都渋谷区'
    };

    // サポートボードのモックデータ（Need Help / Can Help）
    const [posts, setPosts] = useState([
        {
            id: 1,
            type: 'need_help', // 助けてほしい
            title: '来週の水曜日、1時間だけ子供を見ていてほしいです',
            category: '一時預かり・見守り',
            area: '東京都渋谷区',
            author: '佐藤 美咲',
            status: 'open'
        },
        {
            id: 2,
            type: 'can_help', // お手伝いできる
            title: '手作りの離乳食の進め方アドバイス・お下がり服の譲渡',
            category: '相談・お下がり',
            area: '東京都渋谷区',
            author: '田中 恵子',
            status: 'open'
        },
        {
            id: 3,
            type: 'need_help',
            title: '近くの小児科への通院同行（下の子も一緒のため）',
            category: 'お出かけサポート',
            area: '東京都新宿区',
            author: '鈴木 由香',
            status: 'open'
        }
    ]);

    // フィルターの状態（'all', 'need_help', 'can_help'）
    const [filterType, setFilterType] = useState('all');

    const handleLogout = () => {
        navigate('/');
    };

    // フィルターで投稿を絞り込む
    const filteredPosts = posts.filter(post => {
        if (filterType === 'all') return true;
        return post.type === filterType;
    });

    return (
        <div className="dashboard-page">
            {/* ナビゲーションバー */}
            <nav className="navbar">
                <h2>MomConnect</h2>
                <div className="user-info">
                    <span>{user.area} / {user.name} さん</span>
                    <button onClick={handleLogout} className="logout-btn">
                        ログアウト
                    </button>
                </div>
            </nav>

            {/* メインエリア */}
            <main className="main-content">
                <div className="board-header">
                    <h3>サポートボード</h3>
                    <button className="primary-btn" onClick={() => navigate('/create-post')}>＋ 新規投稿する</button>
                </div>

                {/* フィルタータブ */}
                <div className="filter-tabs">
                    <button
                        className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        すべて
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'need_help' ? 'active' : ''}`}
                        onClick={() => setFilterType('need_help')}
                    >
                        🚨 助けてほしい (Need Help)
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'can_help' ? 'active' : ''}`}
                        onClick={() => setFilterType('can_help')}
                    >
                        🤝 お手伝いできる (Can Help)
                    </button>
                </div>

                {/* 投稿リスト */}
                <div className="posts-container">
                    {filteredPosts.length === 0 ? (
                        <p className="no-posts">該当する投稿はありません。</p>
                    ) : (
                        filteredPosts.map(post => (
                            <div key={post.id} className={`post-card ${post.type}`}>
                                <div className="post-meta">
                                    <span className={`badge ${post.type}`}>
                                        {post.type === 'need_help' ? 'Need Help' : 'Can Help'}
                                    </span>
                                    <span className="post-area">📍 {post.area}</span>
                                </div>
                                <h4 className="post-title">{post.title}</h4>
                                <div className="post-footer">
                                    <span className="post-author">投稿者: {post.author}</span>
                                    <button className="detail-btn">詳細・応募する</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}