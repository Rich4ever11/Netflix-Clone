import styles from "./Banner.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import data from "../../data/BannerObjectList.json";

export default function Banner(props: any) {
  const [iterator, setIterator] = useState(0);
  const initialData = data.items[iterator];
  const [titleImgUrl, setTitleImgUrl] = useState(initialData.titleCard);
  const [subTitle, setSubTitle] = useState(initialData.subTitle);
  const [imgUrl, setImgUrl] = useState(initialData.imgUrl);
  const [videoId, setVideoId] = useState(initialData.videoId);
  const [videoHeight, setVideoHeight] = useState(initialData.height);
  const [videoWidth, setVideoWidth] = useState(initialData.width);
  //const { title, subTitle, imgUrl, videoId, titleImgUrl } = props;
  const router = useRouter();

  function setBanner(index: any) {
    const newDataSet = data.items[index];
    setTitleImgUrl(newDataSet.titleCard);
    setSubTitle(newDataSet.subTitle);
    setImgUrl(newDataSet.imgUrl);
    setVideoId(newDataSet.videoId);
    setVideoHeight(newDataSet.height);
    setVideoWidth(newDataSet.width);
  }

  function handleOnTrending() {
    const newIterator = Math.floor(Math.random() * data.items.length);
    setBanner(newIterator);
    setIterator(newIterator);
  }

  function handleOnPlay() {
    router.push(`video/${videoId}`);
  }
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          {iterator === 0 ? (
            <div className={styles.nseriesWrapper}>
              <p className={styles.firstLetter}>
                <Image
                  src="/static/NetflixN.svg"
                  alt="Play Icon"
                  width={50}
                  height={50}
                />
              </p>
              <p className={styles.series}>F I L M</p>
            </div>
          ) : (
            <></>
          )}
          <h2 className={styles.title}>
            <Image
              src={titleImgUrl}
              alt="Play Icon"
              width={videoWidth}
              height={videoHeight}
            />
          </h2>
          <h3 className={styles.subTitle}>{subTitle}</h3>
          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <Image
                src="/static/icons8.png"
                alt="Play Icon"
                width={15}
                height={15}
              />
              <span style={{ color: "white" }}>&nbsp;&nbsp;Play</span>
            </button>
            <button className={styles.btnWithIcon} onClick={handleOnTrending}>
              <span style={{ color: "white" }}>&nbsp;&nbsp;Next Trending</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 100%
          ), url(${imgUrl})`,
        }}
      ></div>
    </div>
  );
}
