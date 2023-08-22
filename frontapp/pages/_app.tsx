import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '../components/UserContext'; // UserProviderをインポートするための正しいパスを指定してください


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
