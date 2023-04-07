import { api } from "~/utils/api";

const CronToggle = () => {
  const { data: enabled, isLoading } = api.crons.getScheduleToggle.useQuery();
  const context = api.useContext();

  // BEEG MUTATION
  const setCheckedMutation = api.crons.setScheduleToggle.useMutation({
    onMutate: (enabled) => {
      // Set the new value
      context.crons.getScheduleToggle.setData(undefined, enabled);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <hr />
      <div className="flex gap-3">
        <label htmlFor="enabled">Enabled</label>
        <input
          type="checkbox"
          onChange={(e) => setCheckedMutation.mutate(e.target.checked)}
          className="w-4 rounded-md p-2"
          checked={enabled}
        />
      </div>
    </>
  );
};

export default CronToggle;
