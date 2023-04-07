import { type NextPage } from "next";
import Head from "next/head";
import "react-js-cron/dist/styles.css";
import CronManager from "~/components/CronManager";
import PostPool from "~/components/PostPool";

const Schedule: NextPage = () => {
  return (
    <>
      <Head>
        <title>Election Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3 className="m-3 text-xl font-bold">Schedule</h3>
      <div className="grid place-items-center">
        <CronManager />
      </div>
      <div>
        <PostPool />
      </div>
    </>
  );
};

export default Schedule;
