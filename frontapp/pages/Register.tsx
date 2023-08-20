import { useState } from 'react'
import { NextPage } from "next"
import { useRouter } from 'next/router'
import LoginStyle from "../styles/login.module.css";

const Register: NextPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/register`, {
      'method': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    })
    const data = await response.json();
    if (response.ok) {
      router.push('/Login')
    } else {
      setMessage(data.message);
    }
  }
  return (
    <div className={LoginStyle.pagelayout}>
      <h1 id={LoginStyle.title}>ANTOQUINO</h1>
      <form onSubmit={handleSubmit}>
        <input
          className={LoginStyle.inputform}
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='User name'
        />
        <input
          className={LoginStyle.inputform}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
        />
        <input
          className={LoginStyle.inputform}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
        />
        <button className={LoginStyle.btn} type='submit'>Sign Up</button>
        <div>{message}</div>
      </form>
    </div>
  )
}
export default Register