import Head from "next/head";
import Questionnaire from "./question/page";
import Navbar from "./(components)/Navbar";

export default function Home() {
  return (
    <div className="md:ml-10">
      <Head>
        <title>Kreatoors</title>
      </Head>
      <Navbar />
      <main className="flex items-center  flex-grow">
        <Questionnaire />
      </main>
    </div>
  );
}
