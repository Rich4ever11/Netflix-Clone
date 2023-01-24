import Head from "next/head";
import NavBar from "../../components/NavBar/NavBar";
import SectionCards from "../../components/Card/Section-Cards";
import { getMyFavouriteVideos } from "../../lib/videos";
import useRedirectUser from "../../utils/redirectUser";

import styles from "../../styles/myList.module.css";

export async function getServerSideProps(context: any) {
  const { userId, cookiesToken } = await useRedirectUser(context);
  const videos = await getMyFavouriteVideos(cookiesToken, userId);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      myListVideos: videos,
    },
  };
}

export default function myList({ myListVideos }: any) {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap={true}
          />
        </div>
      </main>
    </div>
  );
}
