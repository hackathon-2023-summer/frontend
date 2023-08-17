import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = {
        username: username,
        password: password
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
      });

      if (response.ok) {
        // const tokenData = await response.json();
        // // トークンをセッションストレージ、または別の適切な場所に保存
        // sessionStorage.setItem('token', tokenData.access_token);
        // router.push(`${process.env._API_FRONT_URL}/Main`);
        const tokenData = await response.json();
        document.cookie = `userToken=${tokenData.access_token}; path=/`; // クッキーにトークンを保存
        router.push('/Main');

      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <input type="text" placeholder="User name" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Link href="/Register"><button>新規登録</button></Link>
      <button onClick={handleLogin}>Login</button>
      {showError && <div>ログインできませんでした</div>}
    </div>
  );
};

export default LoginPage;
