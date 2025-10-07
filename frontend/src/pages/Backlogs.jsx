import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/sprints";

function Backlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingProject = location.state?.project;

  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSprintId, setEditingSprintId] = useState(null);

  const [newSprint, setNewSprint] = useState({
    name: "",
    duration: "",
    assigned: "",
    techStack: "",
    comment: "",
    completed: false,
  });

  useEffect(() => {
    if (incomingProject) {
      setProject(incomingProject);
    }
  }, [incomingProject]);

  useEffect(() => {
    if (project?._id) {
      fetchSprints(project._id);
    }
  }, [project]);

  const fetchSprints = async (projectId) => {
    try {
      const res = await axios.get(`${API_URL}/${projectId}`);
      setSprints(res.data);
    } catch (err) {
      toast.error("Failed to fetch sprints");
    }
  };

  const handleAddSprint = async () => {
    if (!newSprint.name.trim()) {
      toast.error("Sprint name is required");
      return;
    }

    const formattedName = `${project.name} - ${newSprint.name}`;
    const payload = {
      ...newSprint,
      name: formattedName,
      projectId: project._id,
      projectName: project.name,
    };

    try {
      if (editingSprintId) {
        await axios.put(`${API_URL}/${editingSprintId}`, payload);
        toast.success("Sprint updated!");
      } else {
        await axios.post(API_URL, payload);
        toast.success("Sprint created!");
      }
      fetchSprints(project._id);
      resetForm();
    } catch (err) {
      toast.error("Error saving sprint");
    }
  };

  const handleDeleteSprint = async (id) => {
    if (window.confirm("Are you sure you want to delete this sprint?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Sprint deleted!");
        fetchSprints(project._id);
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleEditSprint = (sprint) => {
    const cleanName = sprint.name.replace(`${project.name} - `, "");
    setNewSprint({ ...sprint, name: cleanName });
    setEditingSprintId(sprint._id);
    setShowModal(true);
  };

  const toggleCompletion = async (sprint) => {
    try {
      await axios.put(`${API_URL}/${sprint._id}`, {
        ...sprint,
        completed: !sprint.completed,
      });
      toast.success("Status updated");
      fetchSprints(project._id);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setNewSprint({
      name: "",
      duration: "",
      assigned: "",
      techStack: "",
      comment: "",
      completed: false,
    });
    setEditingSprintId(null);
    setShowModal(false);
  };

  const handleSprintClick = (sprint) => {
    navigate(`/kanban/${sprint._id}`, {
      state: {
        sprint: {
          _id: sprint._id,
          sprintName: sprint.name,
          projectName: project.name,
        },
      },
    });
  };

  if (!project) {
    return (
      <div className="p-10 text-center text-red-500">
        No project data found.
        <button className="text-blue-500 ml-2" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <ToastContainer />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{`Sprints - ${project.name}`}</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Add Sprint
        </button>
      </div>

      {/* Sprint List */}
      {sprints.length === 0 ? (
        <p className="text-gray-500">No sprints found. Add one to get started.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sprints.map((sprint) => (
              <motion.div
                key={sprint._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-gray-100 rounded shadow cursor-pointer"
                onClick={() => handleSprintClick(sprint)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{sprint.name}</h2>
                    <p className="text-sm text-gray-600">{sprint.comment}</p>
                    <div className="text-xs mt-1">
                      Duration: {sprint.duration}, Assigned: {sprint.assigned}, Tech Stack:{" "}
                      {sprint.techStack}
                    </div>
                    <div className="text-sm mt-2">
                      Status:{" "}
                      <span className={sprint.completed ? "text-green-600" : "text-yellow-600"}>
                        {sprint.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSprint(sprint);
                      }}
                      className="text-sm text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSprint(sprint._id);
                      }}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompletion(sprint);
                      }}
                      className="text-sm text-gray-800 bg-gray-300 px-2 py-1 rounded"
                    >
                      {sprint.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingSprintId ? "Edit Sprint" : "Add Sprint"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                placeholder="Name"
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
                placeholder="Assigned To"
                value={newSprint.assigned}
                onChange={(e) => setNewSprint({ ...newSprint, assigned: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Tech Stack"
                value={newSprint.techStack}
                onChange={(e) => setNewSprint({ ...newSprint, techStack: e.target.value })}
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Comment"
                value={newSprint.comment}
                onChange={(e) => setNewSprint({ ...newSprint, comment: e.target.value })}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newSprint.completed}
                  onChange={(e) => setNewSprint({ ...newSprint, completed: e.target.checked })}
                />
                <span>Mark as Completed</span>
              </label>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSprint}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {editingSprintId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Backlog;
