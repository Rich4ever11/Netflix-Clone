import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { magic } from "../lib/magic-client";
import Loading from "../components/Loading/Loading";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkLoginStatus() {
      const isLoggedIn = await magic?.user.isLoggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
    checkLoginStatus();
  }, []);

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

  //isLoading ? <Loading /> :
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
