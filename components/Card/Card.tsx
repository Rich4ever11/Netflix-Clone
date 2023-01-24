import Image from "next/image";
import { useState } from "react";
import styles from "./Card.module.css";
import { motion } from "framer-motion";
import classNames from "classnames";

export default function Card(props: any) {
  const {
    id,
    imgUrl = "https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    size = "medium",
  } = props;
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap: any = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  function handleOnError(error: any) {
    setImgSrc(
      "https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
    );
    console.log("Image Not Found");
  }

  const scale = { scale: 1.1 };

  return (
    <div className={styles.container}>
      <motion.div
        className={classNames(styles.imgMotionWrapper, classMap[size])}
        whileHover={{ ...scale }}
      >
        <Image
          src={imgSrc}
          alt="Picture of the author"
          layout="fill"
          onError={handleOnError}
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
}
