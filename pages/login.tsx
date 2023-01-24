import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import styles from "../styles/Login.module.css";

export default function login() {
  const [email, setEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  function handleOnChangeEmail(e: any) {
    setUserMessage("");
    setEmail(e.target.value);
  }

  async function handleLoginWithEmail(e: any) {
    e.preventDefault();
    setIsLoading(true);
    if (email) {
      setUserMessage("");
      // log in a user by their email
      try {
        const didToken = await magic?.auth.loginWithMagicLink({
          email,
        });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMessage("Something went wrong logging in!");
          }
        }
      } catch (error) {
        // Handle errors if required!
        setIsLoading(false);
        console.error("Something went wrong logging in!", error);
      }
    } else {
      setIsLoading(false);
      setUserMessage("Email Address Not Found");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Sign-in</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix Logo"
                width={150}
                height={100}
              />
            </div>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMessage}>{userMessage}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}
