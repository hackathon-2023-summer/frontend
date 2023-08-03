import { NextPage } from "next"
import Head from "next/head"
import { FormEvent, useState } from "react"

const APITest: NextPage = () => {
  const [username, setUsername] = useState("")
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/users/${username}`,
      {
        method: "POST"
      },
    )

    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>名前入力画面</title>
      </Head>
      <h2>お名前を入力して下さい</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div>
          <button type="submit">入力完了</button>
        </div>
      </form>
    </>)
}

export default APITest
