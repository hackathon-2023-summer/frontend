import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

// Reactから直接FCを導入
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  /*--- submit時の制御処理　---*/
  const handleLogin = async () => {
    try {
      const data = {
        username: username,
        password: password
      }
      const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
      });

      if (response.ok) {
        router.push('../main');
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
