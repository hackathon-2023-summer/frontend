import { GetServerSideProps, GetServerSidePropsContext } from "next";

export const withAuthCheck = (getServerSidePropsFunc?: GetServerSideProps) =>
  async (context: GetServerSidePropsContext) => {
    const token = context.req.cookies.userToken;

    if (!token) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(context);
    }

    return {
      props: {},
    };
  };