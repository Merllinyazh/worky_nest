import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TaskCard({ id, content, listeners, attributes, setNodeRef, style }) {
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white text-black rounded p-2 shadow mb-2 cursor-move"
    >
      {content}
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
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    review: [],
    completed: [],
  });

  const [taskInput, setTaskInput] = useState('');
  const [activeColumn, setActiveColumn] = useState('todo');
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = {
        id: `${activeColumn}-${Date.now()}`,
        content: taskInput,
      };
      setColumns((prev) => ({
        ...prev,
        [activeColumn]: [...prev[activeColumn], newTask],
      }));
      setTaskInput('');
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    for (const key in columns) {
      const task = columns[key].find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    let sourceCol, task;
    for (const key in columns) {
      if (columns[key].some((t) => t.id === active.id)) {
        sourceCol = key;
        task = columns[key].find((t) => t.id === active.id);
        break;
      }
    }

    const destCol = over.id;

    if (sourceCol && destCol && sourceCol !== destCol) {
      setColumns((prev) => {
        const newSource = prev[sourceCol].filter((t) => t.id !== active.id);
        const newDest = [...prev[destCol], task];
        return {
          ...prev,
          [sourceCol]: newSource,
          [destCol]: newDest,
        };
      });
    }
  };

  const SortableTask = ({ task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <TaskCard
        id={task.id}
        content={task.content}
        listeners={listeners}
        attributes={attributes}
        setNodeRef={setNodeRef}
        style={style}
      />
    );
  };

  const renderColumn = (title, key) => (
    <DroppableColumn id={key}>
      <div className="bg-black text-white rounded-xl shadow-lg p-4 min-h-[250px]">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <SortableContext items={columns[key].map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {columns[key].map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
        <div className="mt-4">
          <input
            className="w-full p-2 rounded text-black"
            placeholder="Create a task..."
            value={activeColumn === key ? taskInput : ''}
            onFocus={() => setActiveColumn(key)}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button
            className="w-full mt-2 bg-violet-700 text-white font-bold py-1 rounded hover:bg-violet-100"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      </div>
    </DroppableColumn>
  );

  return (
    <div className="p-6 bg-violet-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Kanban Board</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderColumn('To Do', 'todo')}
          {renderColumn('In Progress', 'inProgress')}
          {renderColumn('Review', 'review')}
          {renderColumn('Completed', 'completed')}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white text-black rounded p-2 shadow mb-2">
              {activeTask.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
