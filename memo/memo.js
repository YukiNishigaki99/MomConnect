import { supabase } from '../lib/supabase';

const currentPath = window.location.pathname;
const isAuthPage = currentPath === '/login' || currentPath === '/signup';

const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');

// ユーザーのログイン状態をチェック
supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
        // 未ログインの場合
        if (!isAuthPage) {
            // ログインページ以外ならリダイレクト（中身は見せない）
            window.location.href = '/login';
        } else {
            // ログイン・登録ページなら、ログインボタンを表示し、ページを表示する
            loginLink?.classList.remove('hidden');
            logoutBtn?.classList.add('hidden');
            document.documentElement.style.visibility = 'visible'; // 画面を表示
        }
    } else {
        // ログイン済みの場合
        if (isAuthPage) {
            // すでにログインしているのに /login や /signup にいる場合はトップへ戻す
            window.location.href = '/';
        } else {
            // 通常ページならログアウトボタンを表示し、ページを表示する
            loginLink?.classList.add('hidden');
            logoutBtn?.classList.remove('hidden');
            document.documentElement.style.visibility = 'visible'; // 画面を表示
        }
    }
});

// ログアウトボタンの処理
logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
});