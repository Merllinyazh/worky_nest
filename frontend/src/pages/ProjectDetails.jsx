import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border rounded"
            placeholder="Enter project name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 block w-full p-2 border rounded"
            rows="4"
            placeholder="Enter project description"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Team Members</label>
          <div className="mt-2 space-y-2">
            {/* Add team members list here */}
          </div>
        </div>
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProjectDetails;