import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import classnames from "classnames";
import { getYoutubeVideoById } from "../../lib/videos";
import NavBar from "../../components/NavBar/NavBar";
import Like from "../../components/icons/like-icon";
import Dislike from "../../components/icons/dislike-icon";

Modal.setAppElement("#__next");

export async function getStaticProps(context: any) {
  // const video = {
  //   title: "Clifford The Big Red Dog",
  //   publishTime: "1990-10-11",
  //   description:
  //     "As middle schooler Emily Elizabeth struggles to fit in at home and at school, she discovers a small red puppy who is destined to become her best friend from a magical animal rescuer.",
  //   channelTitle: "Paramount Pictures",
  //   viewCount: 213214,
  // };
  const videoId = context?.params?.videoId;

  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  //clifford, irishman, puss in boots, top gun, dont look up
  const listOfVideos = [
    "4zH5iYM4wJo",
    "WHXxVmeGQUc",
    "RqrXhwS33yc",
    "giXco2jaZ_4",
    "SL9aJcqrtnw",
  ];

  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

export default function Video({ video }: any) {
  const router = useRouter();
  const videoId = router?.query?.videoId;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount },
  } = video;

  useEffect(() => {
    async function getData() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data", data);
      if (data.foundVideos) {
        const favourited = data.foundVideos[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDislike(true);
        }
      }
    }
    getData();
  }, []);

  async function handleToggleDislike() {
    console.log("Disliked Video");
    const dislikeValue = !toggleDislike;
    setToggleDislike(!toggleDislike);
    setToggleLike(toggleDislike);

    const response = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        favourited: dislikeValue ? 0 : 1,
      }),
    });
    console.log("data", await response.json());
  }

  async function handleToggleLike() {
    console.log("Liked Video");
    const likeValue = !toggleLike;
    setToggleLike(likeValue);
    setToggleDislike(toggleLike);

    const response = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        favourited: likeValue ? 1 : 0,
      }),
    });
    console.log("data", await response.json());
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch The Video"
        onRequestClose={() => {
          router.back();
        }}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <Dislike selected={toggleDislike} />
            </div>
          </button>
        </div>
        <div>
          <iframe
            id="player"
            type="text/html"
            width="100%"
            height="390"
            src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0`}
            frameborder="0"
            className={styles.videoPlayer}
          ></iframe>
          <div className={styles.modalBody}>
            <div className={styles.modalBodyContent}>
              <div className={styles.columnOne}>
                <p className={styles.publishTime}>{publishTime}</p>
                <p className={styles.title}>{title}</p>
                <p className={styles.description}>{description}</p>
              </div>
              <div className={styles.columnTwo}>
                <p
                  className={classnames(styles.subText, styles.subTextWrapper)}
                >
                  <span className={styles.textColor}>Cast: </span>
                  <span className={styles.channelTitle}>{channelTitle}</span>
                </p>
                <p
                  className={classnames(styles.subText, styles.subTextWrapper)}
                >
                  <span className={styles.textColor}>View Count: </span>
                  <span className={styles.channelTitle}>{viewCount}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
