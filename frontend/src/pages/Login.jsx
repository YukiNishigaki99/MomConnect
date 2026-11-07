import { useNavigate } from "react-router-dom";
import './../css/Login.css';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // あとでここにfacebook認証の処理を入れる
        // テスト用にdashboardへ遷移させる
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <h1>Bakeoff 3 Login</h1>
            <p>Please Login with Facebook Account</p>
            <button className="facebook-login-btn" onClick={handleLogin}>
                Login with Facebook (仮)
            </button>
        </div>
    );
}