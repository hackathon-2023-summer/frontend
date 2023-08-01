import { useState } from 'react'
import { NextPage } from "next"

const Register: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
      'method': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    })
    const data = await response.json();
    setMessage(data.message);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder='Username'
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Password'
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='Email'
      />
      <button type='submit'>register</button>
      <div>{message}</div>
    </form>
  )
}
export default Register