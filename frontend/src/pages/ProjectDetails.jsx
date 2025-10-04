// src/pages/ProjectDetails.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/projects/${id}`, project)
      .then(() => alert('Project updated'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            name="title"
            value={project.title}
            onChange={handleChange}
            type="text"
            className="mt-1 block w-full p-2 border rounded"
            placeholder="Enter project name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            rows="4"
            placeholder="Enter project description"
          ></textarea>
        </div>
        <button
          onClick={handleSave}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProjectDetails;
