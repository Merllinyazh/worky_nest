import { useState } from 'react';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';

function Teams() {
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]);

  const [newCollaborator, setNewCollaborator] = useState('');

  const handleAddCollaborator = () => {
    if (newCollaborator.trim()) {
      setCollaborators([
        ...collaborators,
        { id: collaborators.length + 1, name: newCollaborator.trim() }
      ]);
      setNewCollaborator('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">WORK NEST</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">COLLABORATORS AND TEAMS</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">PROJECT NAME</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Manage Access</span>
            <button 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              onClick={handleAddCollaborator}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add People
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {collaborators.map((collaborator) => (
            <div 
              key={collaborator.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <UserIcon className="h-6 w-6 text-gray-400 mr-3" />
              <span className="text-gray-700">{collaborator.name}</span>
            </div>
          ))}
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Name of the collaborator"
              className="flex-1 rounded-lg border-gray-300 focus:ring-purple-500 focus:border-purple-500"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
            />
            <button
              onClick={handleAddCollaborator}
              className="p-2 text-purple-600 hover:text-purple-800"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teams;