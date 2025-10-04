import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/kanbanprojects";

function TaskCard({ task, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  

  const handleSave = () => {
    onUpdate(task._id, { content });
    setEditing(false);
  };

  return (
    <div className="bg-white text-black rounded p-2 shadow mb-2 cursor-move">
      {editing ? (
        <div>
          <input
            className="w-full p-1 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>{task.content}</div>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} id={id} className="min-h-[250px]">
      {children}
    </div>
  );
}

export default function KanbanBoard() {
  const location = useLocation();
  const sprint = location.state?.sprint;

  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    review: [],
    completed: [],
  });

  const [taskInput, setTaskInput] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    console.log("Sprint ID:", sprint?._id);
    if (!sprint?._id) return;
    fetchTasks();
  }, [sprint?._id]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/${sprint._id}`);
      const tasks = res.data;
      const newColumns = { todo: [], inProgress: [], review: [], completed: [] };
      tasks.forEach((task) => newColumns[task.status].unshift(task));
      setColumns(newColumns);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const handleAddTask = async () => {
    if (!taskInput.trim()) return;
    try {
      const res = await axios.post(API_URL, {
        projectName: sprint.projectName || "Unknown Project",
        sprintName: sprint.sprintName || "Sprint",
        sprintId: sprint._id,
        content: taskInput,
        status: "todo",
      });
      setColumns((prev) => ({ ...prev, todo: [res.data, ...prev.todo] }));
      setTaskInput("");
    } catch {
      toast.error("Failed to add task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await axios.put(`${API_URL}/${taskId}`, updatedData);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    for (const key in columns) {
      const task = columns[key].find((t) => t._id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    let sourceCol, task;
    for (const key in columns) {
      if (columns[key].some((t) => t._id === active.id)) {
        sourceCol = key;
        task = columns[key].find((t) => t._id === active.id);
        break;
      }
    }

    const destCol = over.id;
    if (sourceCol && destCol && sourceCol !== destCol) {
      await handleUpdateTask(task._id, { status: destCol });
    }
  };

  const SortableTask = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: task._id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <TaskCard task={task} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
      </div>
    );
  };

  const renderColumn = (title, key) => (
    <DroppableColumn id={key}>
      <div className="bg-black text-white rounded-xl shadow-lg p-4 min-h-[250px]">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <SortableContext
          items={columns[key].map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {columns[key].map((task) => (
            <SortableTask key={task._id} task={task} />
          ))}
        </SortableContext>
        {key === "todo" && (
          <div className="mt-4">
            <input
              className="w-full p-2 rounded text-black"
              placeholder="Create a task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button
              className="w-full mt-2 bg-violet-700 text-white font-bold py-1 rounded"
              onClick={handleAddTask}
            >
              Add Task
            </button>
          </div>
        )}
      </div>
    </DroppableColumn>
  );

  return (
    <div className="p-6 bg-violet-900 min-h-screen">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Kanban Board
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderColumn("To Do", "todo")}
          {renderColumn("In Progress", "inProgress")}
          {renderColumn("Review", "review")}
          {renderColumn("Completed", "completed")}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="bg-white text-black rounded p-2 shadow mb-2">
              {activeTask.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
