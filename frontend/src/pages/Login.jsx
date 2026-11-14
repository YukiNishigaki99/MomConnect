import { useNavigate } from "react-router-dom";
import api from "../api";
import './../css/Login.css';

export default function Login() {
    const navigate = useNavigate();

    const handleFacebookLogin = () => {
        // SDKがまだ読み込まれていない場合のガード
        if (!window.FB) {
            alert("Facebook SDK is still loading. Please try again in a moment.");
            return;
        }

        // Facebookログインのポップアップを表示
        window.FB.login(function (response) {
            if (response.authResponse) {
                console.log('Facebook authentication successful:', response);

                // ログイン成功後、ユーザーのプロフィール情報（名前やメールアドレス）を取得
                window.FB.api('/me', { fields: 'name,email' }, async function (userInfo) {
                    console.log('Fetched Facebook user info:', userInfo);

                    try {
                        // FastAPIバックエンドへ送信してデータベースに登録／ログイン
                        const backendResponse = await api.post('/auth/facebook', {
                            name: userInfo.name || "Anonymous Mom",
                            email: userInfo.email || `${userInfo.id}@facebook.tmp`,
                            facebook_id: userInfo.id
                        });

                        console.log("Backend authentication successful:", backendResponse.data);

                        // ユーザー情報をlocalStorageに保存
                        localStorage.setItem("user", JSON.stringify(backendResponse.data.user));

                        // ダッシュボードへ画面遷移
                        navigate('/dashboard');
                    } catch (error) {
                        console.error("Backend error:", error.response?.data?.detail || error.message);
                        alert("Failed to authenticate with the server.");
                    }
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'public_profile,email' }); // 取得したい権限スコープ
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>MomConnect</h1>
                <p>Connecting moms in your local community</p>
                <button className="facebook-login-btn" onClick={handleFacebookLogin}>
                    <span>f</span> Login with Facebook
                </button>
            </div>
        </div>
    );
}