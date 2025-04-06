import { useState } from 'react';

interface UploadPanelProps {
  onFileUpload: (file: File) => void;
}

export default function UploadPanel({ onFileUpload }: UploadPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Upload Sheet Music</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a file (PNG, JPG, or PDF)
          </label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        {previewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
} 