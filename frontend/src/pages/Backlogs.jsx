import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Backlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingProject = location.state?.project;

  const [project, setProject] = useState(() => {
    const stored = localStorage.getItem("current_project");
    return incomingProject || (stored ? JSON.parse(stored) : null);
  });

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

  // Persist current project to localStorage
  useEffect(() => {
    if (incomingProject) {
      localStorage.setItem("current_project", JSON.stringify(incomingProject));
      setProject(incomingProject);
    }
  }, [incomingProject]);

  // Load sprints or initialize with 2 default sprints if none exist
  useEffect(() => {
    if (project?.id) {
      const stored = localStorage.getItem('sprints_by_project');
      const allSprints = stored ? JSON.parse(stored) : {};

      if (!allSprints[project.id] || allSprints[project.id].length === 0) {
        const defaultSprints = [
          {
            id: Date.now(),
            name: 'Sprint 1',
            duration: '1 week',
            assigned: 'Team A',
            techStack: 'React, Node.js',
            comment: 'Initial setup and planning',
            completed: false,
          },
          {
            id: Date.now() + 1,
            name: 'Sprint 2',
            duration: '1 week',
            assigned: 'Team B',
            techStack: 'Django, PostgreSQL',
            comment: 'Authentication & backend integration',
            completed: false,
          },
        ];
        allSprints[project.id] = defaultSprints;
        localStorage.setItem('sprints_by_project', JSON.stringify(allSprints));
        setSprints(defaultSprints);
      } else {
        setSprints(allSprints[project.id]);
      }
    }
  }, [project?.id]);

  // Save sprints to localStorage whenever they change
  useEffect(() => {
    if (project?.id) {
      const stored = localStorage.getItem('sprints_by_project');
      const allSprints = stored ? JSON.parse(stored) : {};
      allSprints[project.id] = sprints;
      localStorage.setItem('sprints_by_project', JSON.stringify(allSprints));
    }
  }, [sprints, project?.id]);

  const handleAddSprint = () => {
    if (!newSprint.name.trim()) {
      toast.error('Sprint name is required');
      return;
    }

    const updated = editingSprintId
      ? sprints.map((s) => (s.id === editingSprintId ? { ...newSprint, id: editingSprintId } : s))
      : [...sprints, { ...newSprint, id: Date.now() }];

    setSprints(updated);
    setShowModal(false);
    setEditingSprintId(null);
    setNewSprint({
      name: '',
      duration: '',
      assigned: '',
      techStack: '',
      comment: '',
      completed: false,
    });

    toast.success(editingSprintId ? 'Sprint updated!' : 'Sprint added!');
  };

  const handleDeleteSprint = (id) => {
    setDeletingSprintId(id);
    setTimeout(() => {
      const updated = sprints.filter((s) => s.id !== id);
      setSprints(updated);
      setDeletingSprintId(null);
      toast.error('Sprint deleted!');
    }, 400);
  };

  const handleEditSprint = (sprint) => {
    setNewSprint(sprint);
    setEditingSprintId(sprint.id);
    setShowModal(true);
  };

  const toggleSprintCompletion = (id) => {
    const updated = sprints.map((s) =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    setSprints(updated);
    toast.success('Sprint status updated!');
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 p-4 text-center">
          No project data found. Please select a project first.
          <button
            onClick={() => navigate('/')}
            className="block mt-4 text-blue-600 hover:underline"
          >
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-6 rounded relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-black">Backlogs</h1>
          <p className="text-sm text-gray-600">Project: {project.name}</p>
        </div>
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

      {sprints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No sprints found. Add one to get started!
        </div>
      ) : (
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
                  <div className="text-xs text-gray-500">
                    {sprint.completed ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <span className="text-yellow-600">In Progress</span>
                    )}
                  </div>
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
                  <div><strong>Duration:</strong> {sprint.duration}</div>
                  <div><strong>Assigned:</strong> {sprint.assigned}</div>
                  <div><strong>Tech Stack:</strong> {sprint.techStack}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-inner text-sm text-gray-700 flex-1 min-h-[80px]">
                  {sprint.comment || 'No Comments'}
                </div>
              </div>

              <button
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700"
                onClick={() =>
                  navigate('/kanban', {
                    state: { sprint, project },
                  })
                }
              >
                START
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">
              {editingSprintId ? 'Edit Sprint' : 'Add New Sprint'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full p-2 border rounded"
                placeholder="Sprint Name"
                value={newSprint.name}
                onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Duration"
                value={newSprint.duration}
                onChange={(e) => setNewSprint({ ...newSprint, duration: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Assigned"
                value={newSprint.assigned}
                onChange={(e) => setNewSprint({ ...newSprint, assigned: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Tech Stack"
                value={newSprint.techStack}
                onChange={(e) => setNewSprint({ ...newSprint, techStack: e.target.value })}
              />
            </div>

            <textarea
              className="w-full mt-4 p-2 border rounded resize-none h-24"
              placeholder="Comment"
              value={newSprint.comment}
              onChange={(e) => setNewSprint({ ...newSprint, comment: e.target.value })}
            />

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="completed"
                checked={newSprint.completed}
                onChange={(e) => setNewSprint({ ...newSprint, completed: e.target.checked })}
              />
              <label htmlFor="completed" className="ml-2">Mark as completed</label>
            </div>

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
                {editingSprintId ? 'Update' : 'Add Sprint'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Backlog;
