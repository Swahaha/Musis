import { useState } from 'react';

interface NotePopupProps {
  xml: string;
  onClose: () => void;
  onEdit: (newXml: string) => void;
  onDelete: () => void;
}

export default function NotePopup({ xml, onClose, onEdit, onDelete }: NotePopupProps) {
  const [editedXml, setEditedXml] = useState(xml);

  const handleEdit = () => {
    onEdit(editedXml);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Note Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MusicXML
          </label>
          <textarea
            value={editedXml}
            onChange={(e) => setEditedXml(e.target.value)}
            className="w-full h-48 p-2 border rounded-md font-mono text-sm"
            readOnly={false}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 