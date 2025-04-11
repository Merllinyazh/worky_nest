import React, { useState } from 'react';
import { useLocation, useParams,useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Backlog() {
  const { id } = useParams();
  const location = useLocation();
  const project = location.state?.project;
  const navigate = useNavigate();

  const [sprints, setSprints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingSprintId, setDeletingSprintId] = useState(null);
  const [editingSprintId, setEditingSprintId] = useState(null);

  const [newSprint, setNewSprint] = useState({
    name: '',
    duration: '',
    assigned: '',
    techStack: '',
    comment: '',
    completed: false,
  });

  const handleAddSprint = () => {
    if (editingSprintId) {
      setSprints((prev) =>
        prev.map((s) =>
          s.id === editingSprintId ? { ...newSprint, id: editingSprintId } : s
        )
      );
      toast.success('Sprint updated!');
    } else {
      setSprints((prev) => [...prev, { ...newSprint, id: Date.now() }]);
      toast.success('Sprint added!');
    }
    setShowModal(false);
    setNewSprint({
      name: '',
      duration: '',
      assigned: '',
      techStack: '',
      comment: '',
      completed: false,
    });
    setEditingSprintId(null);
  };

  const handleDeleteSprint = (id) => {
    setDeletingSprintId(id);
    setTimeout(() => {
      setSprints((prev) => prev.filter((s) => s.id !== id));
      toast.error('Sprint deleted!');
      setDeletingSprintId(null);
    }, 400); // match fade-out duration
  };

  const handleEditSprint = (sprint) => {
    setNewSprint(sprint);
    setEditingSprintId(sprint.id);
    setShowModal(true);
  };

  const toggleSprintCompletion = (id) => {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      )
    );
    toast.success('Sprint status updated!');
  };

  if (!project)
    return <div className="text-red-500 p-4">No project data found.</div>;

  return (
    <div className="flex-1 bg-white p-6 rounded relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Backlogs - {project.name}</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingSprintId(null);
            setNewSprint({
              name: '',
              duration: '',
              assigned: '',
              techStack: '',
              comment: '',
              completed: false,
            });
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
        >
          Add Sprint
        </button>
      </div>

      <AnimatePresence>
        {sprints.map((sprint) => (
          <motion.div
            key={sprint.id}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className={`bg-gray-100 mb-4 rounded-lg p-4 shadow transition-all ${
              deletingSprintId === sprint.id ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-md font-semibold text-gray-800">{sprint.name}</h3>
              </div>
              <div className="text-right space-y-1">
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditSprint(sprint)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSprint(sprint.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    ×
                  </button>
                </div>
                <button
                  onClick={() => toggleSprintCompletion(sprint.id)}
                  className={`mt-1 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    sprint.completed
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                >
                  {sprint.completed ? '✅ Completed' : '✔️ Mark Complete'}
                </button>
              </div>
            </div>

            <div className="mt-3 flex gap-4">
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <strong>Duration:</strong> {sprint.duration}
                </div>
                <div>
                  <strong>Assigned:</strong> {sprint.assigned}
                </div>
                <div>
                  <strong>Tech Stack:</strong> {sprint.techStack}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-inner text-sm text-gray-700 flex-1 h-full min-h-[80px]">
                {sprint.comment || 'No Comments'}
              </div>
            </div>

            <button
  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700"
  onClick={() =>
    navigate(`/KanbanBoard/`, {
      state: {
        sprint,
        project,
      },
    })
  }
>
  START
</button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sprint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">
              {editingSprintId ? 'Edit Sprint' : 'Add New Sprint'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full p-2 border rounded"
                placeholder="SPRINT NAME"
                value={newSprint.name}
                onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="DURATION"
                value={newSprint.duration}
                onChange={(e) => setNewSprint({ ...newSprint, duration: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="ASSIGNED"
                value={newSprint.assigned}
                onChange={(e) => setNewSprint({ ...newSprint, assigned: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="TECHNOLOGY STACK"
                value={newSprint.techStack}
                onChange={(e) => setNewSprint({ ...newSprint, techStack: e.target.value })}
              />
            </div>

            <textarea
              className="w-full mt-4 p-2 border rounded resize-none h-24"
              placeholder="COMMENT"
              value={newSprint.comment}
              onChange={(e) => setNewSprint({ ...newSprint, comment: e.target.value })}
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSprintId(null);
                }}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSprint}
                className="px-4 py-2 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                {editingSprintId ? 'Update' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Backlog;
