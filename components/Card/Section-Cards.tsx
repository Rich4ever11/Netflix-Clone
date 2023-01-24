import Link from "next/link";
import Card from "./Card";
import styles from "./Section-Cards.module.css";
import classes from "classnames";

export default function SectionCards(props: any) {
  const { title, videos = [], size, shouldWrap = false } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={classes(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video: any, index: number) => (
          <Link href={`/video/${video.id}`}>
            <Card id={index} imgUrl={video.imgUrl} size={size} />
          </Link>
        ))}
      </div>
    </section>
  );
}
