import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Reminder, ReminderPriority } from "../model/reminder.types";

interface ReminderModalProps {
  mode: "create" | "edit" | "view";
  reminder?: Reminder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: Omit<Reminder, "id" | "createdAt"> | Reminder) => void;
  onDelete?: () => void;
}

const PRIORITIES: ReminderPriority[] = ["low", "medium", "high"];

const ReminderModal = ({
  mode,
  reminder,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ReminderModalProps) => {
  const [title, setTitle] = useState(reminder?.title ?? "");
  const [description, setDescription] = useState(reminder?.description ?? "");
  const [dateTime, setDateTime] = useState(reminder?.dateTime ?? "");
  const [priority, setPriority] = useState<ReminderPriority>(
    reminder?.priority ?? "medium",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(reminder?.title ?? "");
    setDescription(reminder?.description ?? "");
    setDateTime(reminder?.dateTime ?? "");
    setPriority(reminder?.priority ?? "medium");
    setError("");
  }, [isOpen, reminder]);

  if (!isOpen) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!dateTime.trim() || Number.isNaN(Date.parse(dateTime))) {
      setError("Valid date and time are required.");
      return;
    }

    if (mode === "view" && reminder) {
      onClose();
      return;
    }

    const payload: Omit<Reminder, "id" | "createdAt"> = {
      title: title.trim(),
      description: description.trim() || undefined,
      dateTime,
      priority,
    };

    if (mode === "edit" && reminder) {
      onSave({ ...reminder, ...payload });
    } else {
      onSave(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === "create"
                ? "Add Reminder"
                : mode === "edit"
                  ? "Edit Reminder"
                  : "View Reminder"}
            </h2>
            <p className="text-xs text-gray-500">
              {mode === "view"
                ? "Read only details"
                : "Fill in reminder details"}
            </p>
          </div>
          <button
            className="text-gray-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              value={title}
              disabled={mode === "view"}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              value={description}
              disabled={mode === "view"}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              value={dateTime}
              disabled={mode === "view"}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              value={priority}
              disabled={mode === "view"}
              onChange={(e) => setPriority(e.target.value as ReminderPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            {mode !== "view" && (
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-blue-600 text-white"
              >
                {mode === "create" ? "Create" : "Save"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-gray-300"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "create" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-2 rounded-lg border border-red-500 text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
