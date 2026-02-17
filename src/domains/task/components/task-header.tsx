import { useState } from "react";
import CreateTaskModal from "../modal/create-task-modal";

const TaskHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tasks</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {open && <CreateTaskModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default TaskHeader;
