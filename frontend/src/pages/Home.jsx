import { Link } from 'react-router-dom';
import { PlusIcon, ClockIcon, UserGroupIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function Home() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: 'Marketing Website Redesign',
            description: 'Complete overhaul of the company marketing website with new branding',
            team: ['John D.', 'Sarah M.', 'Mike R.'],
            progress: 75,
            priority: 'High',
            dueDate: '2024-03-15',
          },
          {
            id: 2,
            name: 'Mobile App Development',
            description: 'Native mobile application for iOS and Android platforms',
            team: ['Alex K.', 'Emma S.'],
            progress: 45,
            priority: 'Medium',
            dueDate: '2024-04-01',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    team: '',
    progress: '',
    priority: 'Medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', description: '', team: '', progress: '', priority: 'Medium', dueDate: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      team: form.team.split(',').map((member) => member.trim()),
      progress: parseInt(form.progress, 10),
      priority: form.priority,
      dueDate: form.dueDate,
    };
  
    setProjects((prev) => {
      const updated = [...prev, newProject];
      localStorage.setItem('projects', JSON.stringify(updated));
      localStorage.setItem(`project_${newProject.id}`, JSON.stringify(newProject));
      return updated;
    });
  
    resetForm();
    setShowModal(false);
  };

  const handleEditProject = () => {
    const updatedProjects = projects.map((p) =>
      p.id === editingId
        ? {
            ...p,
            name: form.name,
            description: form.description,
            team: form.team.split(',').map((m) => m.trim()),
            progress: parseInt(form.progress, 10),
            priority: form.priority,
            dueDate: form.dueDate,
          }
        : p
    );

    setProjects(updatedProjects);
    resetForm();
    setShowModal(false);
  };

  const openEditModal = (project) => {
    setForm({
      name: project.name,
      description: project.description,
      team: project.team.join(', '),
      progress: project.progress.toString(),
      priority: project.priority,
      dueDate: project.dueDate,
    });
    setEditingId(project.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteProject = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (confirmed) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track your active projects</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Project
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Project Description"
                className="w-full border px-3 py-2 rounded"
                value={form.description}
                onChange={handleChange}
              />
              <input
                type="text"
                name="team"
                placeholder="Team Members (comma separated)"
                className="w-full border px-3 py-2 rounded"
                value={form.team}
                onChange={handleChange}
              />
              <input
                type="number"
                name="progress"
                placeholder="Progress %"
                className="w-full border px-3 py-2 rounded"
                value={form.progress}
                onChange={handleChange}
              />
              <select
                name="priority"
                className="w-full border px-3 py-2 rounded"
                value={form.priority}
                onChange={handleChange}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <input
                type="date"
                name="dueDate"
                className="w-full border px-3 py-2 rounded"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleEditProject : handleCreateProject}
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {projects.map((project) => (
            <Link to={`/Backlogs/${project.id}`} state={{ project }} key={project.id} className="block">

              <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                className="bg-white rounded-lg shadow-card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="block p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : project.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {project.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">{project.description}</p>

                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-xs font-semibold text-purple-600">Progress</span>
                        <span className="text-xs font-semibold text-purple-600">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                        <div
                          style={{ width: `${project.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {project.team.length} members
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditModal(project);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <PencilSquareIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Home;
