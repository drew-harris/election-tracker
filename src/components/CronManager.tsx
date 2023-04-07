import cronstrue from "cronstrue";
import { useEffect, useState } from "react";
import Cron from "react-js-cron";
import "react-js-cron/dist/styles.css";
import { api } from "~/utils/api";
import CronToggle from "./CronToggle";

const CronManager = () => {
  const { data: serverCron } = api.crons.getCron.useQuery();
  const context = api.useContext();
  const [human, setHuman] = useState("");

  // BEEG MUTATION
  const updateCronMutation = api.crons.setCron.useMutation({
    onMutate: ({ cron }) => {
      // Set the new value
      context.crons.getCron.setData(undefined, cron);
    },
    onError: (error) => {
      alert("Error updating cron: " + error);
    },
  });

  const setValue = (cron: string) => {
    if (cron === serverCron) return;
    updateCronMutation.mutate({ cron });
  };

  useEffect(() => {
    if (serverCron) {
      const humanizedCron = cronstrue.toString(serverCron || "", {
        use24HourTimeFormat: true,
      });
      setHuman(humanizedCron);
    }
  }, [serverCron]);

  return (
    <div className="mb-8 grid place-items-center">
      {serverCron && (
        <Cron
          mode="single"
          humanizeValue={true}
          humanizeLabels={true}
          clearButton={false}
          clockFormat={"12-hour-clock"}
          value={serverCron}
          setValue={setValue}
        />
      )}
      <div className="mb-4 italic">({human})</div>
      <CronToggle />
    </div>
  );
};

export default CronManager;
