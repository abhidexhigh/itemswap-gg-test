"use client";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Layout from "@components/layout";
import Header from "@sections/Header/v2";
import Footer from "@sections/Footer/v1";
import NewsAndPatchesTabs from "src/components/tabs/NewsAndPatchesTabs";

export default function UpdatesPage() {
  const { t } = useTranslation();

  return (
    <main>
      <div>
        <Head>
          <title>Updates - Force of Rune</title>
          <meta
            name="description"
            content="Stay updated with the latest patch notes and news for Force of Rune"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Layout>
          <Header />
          <div
            className="min-h-screen w-full overflow-hidden"
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dg0cmj6su/image/upload/v1750332953/Guild_Web_Bottom_Extended_Large_copy_wnyobh_layppc.webp)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom",
            }}
          >
            <NewsAndPatchesTabs />
            <Footer />
          </div>
        </Layout>
      </div>
    </main>
  );
}
