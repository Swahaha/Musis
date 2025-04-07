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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full border border-[#DDA853] border-opacity-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#183B4E]">Note Details</h2>
          <button
            onClick={onClose}
            className="text-[#27548A] hover:text-[#183B4E] transition-all duration-200 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#27548A] mb-2">
            MusicXML
          </label>
          <textarea
            value={editedXml}
            onChange={(e) => setEditedXml(e.target.value)}
            className="w-full h-48 p-2 border border-[#DDA853] border-opacity-20 rounded-md font-mono text-sm text-[#183B4E] focus:ring-[#27548A] focus:border-[#27548A]"
            readOnly={false}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-[#DDA853] text-[#183B4E] rounded-md hover:bg-opacity-80 transition-all duration-200"
          >
            Delete
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-[#27548A] text-[#F5EEDC] rounded-md hover:bg-opacity-80 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 