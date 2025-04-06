'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import UploadPanel from '../components/UploadPanel';
import ScoreViewer from '../components/ScoreViewer';
import NotePopup from '../components/NotePopup';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const [selectedNoteXml, setSelectedNoteXml] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    setHasUploadedFile(true);
  };

  const handleNoteClick = (xml: string) => {
    setSelectedNoteXml(xml);
    setShowPopup(true);
  };

  const handleEdit = (newXml: string) => {
    console.log('Edited XML:', newXml);
    setShowPopup(false);
  };

  const handleDelete = () => {
    console.log('Note deleted');
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Musis</h1>
              <p className="ml-2 text-sm text-gray-500">Optical Music Recognition</p>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-gray-700">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/api/auth/signin" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="w-1/2 border-r">
          <UploadPanel onFileUpload={handleFileUpload} />
        </div>
        <div className="w-1/2">
          {hasUploadedFile ? (
            <ScoreViewer onNoteClick={handleNoteClick} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Upload a file to see the score
            </div>
          )}
        </div>
        {showPopup && selectedNoteXml && (
          <NotePopup
            xml={selectedNoteXml}
            onClose={() => setShowPopup(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
} 