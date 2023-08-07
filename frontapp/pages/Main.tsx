import { GetServerSideProps, NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <h1>Hello Antoquino</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ここで認証チェックを行う。例えば、Cookieやセッションを使用してチェックすることができます。
  const token = context.req.cookies.userToken;

  if (!token) {
    // ログインしていない場合は、ログインページへリダイレクト
    return {
      redirect: {
        destination: '/Login',
        permanent: false,
      },
    };
  }

  // ログインしている場合は、ページコンポーネントにプロップを渡す（もしあれば）
  return {
    props: {}, // ページコンポーネントに渡すためのプロップ
  };
};

export default Home;
