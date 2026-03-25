import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdEdit } from "react-icons/md";
import {
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "../model/reminder.slice";
import {
  selectReminders,
  selectReminderLoading,
} from "../model/reminder.selectors";
import type { AppDispatch } from "../../../store/store";
import type { Reminder } from "../model/reminder.types";
import ReminderModal from "./reminder-modal";
import DeleteConfirmationModal from "../../task/modal/delete-confirmation-modal";

const RemindersWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector(selectReminders);
  const loading = useSelector(selectReminderLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selected, setSelected] = useState<Reminder | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  const upcoming = useMemo(() => {
    const sorted = [...reminders].sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
    return sorted.slice(0, 5);
  }, [reminders]);

  const openCreate = () => {
    setSelected(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openView = (reminder: Reminder) => {
    setSelected(reminder);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleSave = async (
    value: Omit<Reminder, "id" | "createdAt"> | Reminder,
  ) => {
    if (modalMode === "create") {
      await dispatch(
        createReminder(value as Omit<Reminder, "id" | "createdAt">),
      ).unwrap();
    } else if (modalMode === "edit" && selected) {
      await dispatch(updateReminder(value as Reminder)).unwrap();
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await dispatch(deleteReminder(selected.id)).unwrap();
    setDeleteOpen(false);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Reminders</h3>
          <p className="text-xs text-gray-500">
            Keep track of your important reminders
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs"
        >
          <MdAdd className="text-base" /> Add Reminder
        </button>
      </div>

      {loading && reminders.length === 0 ? (
        <div className="text-sm text-gray-500">Loading reminders...</div>
      ) : reminders.length === 0 ? (
        <div className="text-sm text-gray-500">
          No reminders yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((reminder) => (
            <div
              key={reminder.id}
              className="border border-gray-200 rounded-lg p-2 bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  className="text-left"
                  onClick={() => openView(reminder)}
                >
                  <div className="font-medium text-gray-800">
                    {reminder.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(reminder.dateTime).toLocaleString()}
                  </div>
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelected(reminder);
                      setModalMode("edit");
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 text-xs flex items-center gap-1"
                  >
                    <MdEdit className="text-[14px]" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelected(reminder);
                      setDeleteOpen(true);
                    }}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Priority: {reminder.priority}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReminderModal
        isOpen={isModalOpen}
        mode={modalMode}
        reminder={selected}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={() => setDeleteOpen(true)}
      />

      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Reminder"
        message={`Delete reminder ${selected?.title ?? "this reminder"}?`}
      />
    </div>
  );
};

export default RemindersWidget;
