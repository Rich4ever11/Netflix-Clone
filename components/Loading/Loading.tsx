import styles from "./Loading.module.css";
import Image from "next/image";

export default function Loading() {
  return (
    <div className={styles.loadWrapper}>
      <div className={styles.logoWrapper}>
        <Image
          src="/static/netflix.svg"
          alt="Netflix Logo"
          width={400}
          height={400}
        />
      </div>
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
