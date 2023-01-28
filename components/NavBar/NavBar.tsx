import { useRouter } from "next/router";
import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { magic } from "../../lib/magic-client";
import { useEffect, useState } from "react";

export default function (props: any) {
  const { username } = props;
  const [showDropdown, setDropDown] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [didToken, setDidToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Assumes a user is already logged in
    try {
      const getEmail = async () => {
        const { email }: any = (await magic?.user?.getMetadata()) || "";
        const didToken = (await magic?.user.getIdToken()) || "";

        if (email) {
          setUserEmail(email);
          setDidToken(didToken);
        }
      };
      getEmail();
    } catch (error) {
      // Handle errors if required!
      console.error("Error retrieving email", error);
    }
  }, []);

  async function handleSignOut(event: any) {
    event?.preventDefault;
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      router.push("/login");
    } catch (error) {
      // Handle errors if required!
      console.error("Error Signing User Out", error);
      router.push("/login");
    }
  }

  function handleOnClickHome(event: any) {
    event?.preventDefault;
    router.push("/");
  }

  function handleOnClickMyList(event: any) {
    event?.preventDefault;
    router.push("/browse/my-list");
  }

  function handleShowDropdown(event: any) {
    event?.preventDefault;
    setDropDown(!showDropdown);
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src="/static/netflix.svg"
              alt="Netflix Logo"
              width={150}
              height={100}
            />
          </div>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleOnClickMyList}>
            Contact Support
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <Image
                src="/static/Netflix-avatar.png"
                alt="Expand More Icon"
                width={50}
                height={50}
              />
              <Image
                src="/static/expandMore.svg"
                alt="Expand More Icon"
                width={20}
                height={20}
              />
            </button>

            {showDropdown ? (
              <div className={styles.navDropdown}>
                <a className={styles.linkName} onClick={handleSignOut}>
                  Sign Out
                </a>
                <div className={styles.lineWrapper}></div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
