import { NextPage } from "next"
import Head from "next/head"
import { FormEvent, useState } from "react"

const APITest: NextPage = () => {
  const [username, setUsername] = useState("")
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${username}`,
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



// <!DOCTYPE html>
// <html lang="ja">

// <head>
//   <meta charset="utf-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//   <title>名前入力画面</title>
// </head>

// <body>
//   <h2>お名前を入力して下さい</h2>
//   <form method="post">
//     <input type="text" placeholder="Name" name="username">
//     <div>
//       <button>入力完了</button>
//     </div>
//   </form>
//   <script src="app.js"></script>
// </body>

// <script>
//   window.API_BASE_URL = 'http://localhost:80';
//   //window.API_BASE_URL = '';
// </script>

// </html>

// window.onload = function () {
//   const form = document.querySelector('form');
//   form.addEventListener('submit', function (event) {
//     console.log("click")
//     event.preventDefault();
//     const username = document.querySelector('input[name="username"]').value;
//     //fetch(`http://localhost:80/api/users/${username}`, {
//     fetch(`${window.API_BASE_URL}/api/users/${username}`, {
//       method: 'POST'
//     })
//       .then(response => response.json())
//       .then(data => console.log(data))
//       .catch(error => console.error('Error:', error));
//   });
// };