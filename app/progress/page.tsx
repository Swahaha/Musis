'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

type ProgressStage = {
  id: number;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  description: string;
};

type Feature = {
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
};

export default function ProgressPage() {
  const { data: session } = useSession();
  const [stages] = useState<ProgressStage[]>([
    {
      id: 1,
      name: 'Input',
      status: 'completed',
      description: 'Raw scanned or photographed sheet music image.'
    },
    {
      id: 2,
      name: 'Image Preprocessing',
      status: 'in_progress',
      description: 'Normalize orientation (rotate/skew correction). Resize, denoise, binarize if needed.'
    },
    {
      id: 3,
      name: 'Semantic Segmentation',
      status: 'pending',
      description: 'Classify pixels into: Staff lines, Musical symbols (notes, clefs, rests, etc.)'
    },
    {
      id: 4,
      name: 'Staff Line Processing',
      status: 'pending',
      description: 'Detect and group staff lines. Extract geometric properties (spacing, position). Use horizontal projection to bin and isolate.'
    },
    {
      id: 5,
      name: 'Notehead Detection',
      status: 'pending',
      description: 'Locate and classify noteheads. Group noteheads per staff. Identify chords using stem direction & proximity.'
    },
    {
      id: 6,
      name: 'Symbol Detection (Non-note)',
      status: 'pending',
      description: 'Detect clefs, accidentals, rests, barlines. Use SVM or CNN on extracted symbol regions. Classify based on shape features & position.'
    },
    {
      id: 7,
      name: 'Rhythm Analysis',
      status: 'pending',
      description: 'Infer note durations via: Beams, flags, and dots. Stems and context around noteheads. Subtract known symbols to isolate rhythm cues.'
    },
    {
      id: 8,
      name: 'Measure & Beat Structuring',
      status: 'pending',
      description: 'Align notes into measures using barlines. Determine beat positions within measures.'
    },
    {
      id: 9,
      name: 'Key Signature Detection',
      status: 'pending',
      description: 'Count sharps/flats to infer key.'
    },
    {
      id: 10,
      name: 'MusicXML Generation',
      status: 'completed',
      description: 'Convert all parsed musical information into structured MusicXML format.'
    }
  ]);

  const [features] = useState<Feature[]>([
    { title: 'Uploading functionality', status: 'completed' },
    { title: 'Basic XML display', status: 'completed' },
    { title: 'Exporting as XML, PDF, or MIDI', status: 'completed' },
    { title: 'Auth and Login', status: 'in_progress' },
    { title: 'Editing the Score Viewer', status: 'in_progress' },
    { title: 'Fix Score Viewer Zoom (Double Render)', status: 'pending' }
  ]);

  const getStatusColor = (status: ProgressStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#27548A]'; // blue
      case 'in_progress':
        return 'bg-[#DDA853]'; // golden
      case 'pending':
        return 'bg-[#183B4E]'; // navy
      default:
        return 'bg-[#183B4E]'; // navy
    }
  };

  const getStatusBgColor = (status: ProgressStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#DDA853] bg-opacity-5'; // light beige
      case 'in_progress':
        return 'bg-[#F5EEDC] bg-opacity-50'; // light golden
      case 'pending':
        return 'bg-[#F5EEDC] bg-opacity-30'; // very light beige
      default:
        return 'bg-[#F5EEDC] bg-opacity-30'; // very light beige
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#183B4E] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  href="/"
                  className="inline-flex items-center px-4 py-2 rounded-lg text-[#F5EEDC] hover:bg-[#27548A] transition-all duration-200"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Back to Score
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Content */}
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-bold text-[#183B4E] mb-2">ML Progress Status</h1>
          <p className="text-lg text-[#27548A] mb-12">Track the development progress of our ML pipeline</p>
          
          <div className="space-y-8">
            {stages.map((stage, index) => (
              <div key={stage.id}>
                <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-[#DDA853] border-opacity-20 ${getStatusBgColor(stage.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-[#183B4E]">{stage.name}</h2>
                        <div className="ml-4 flex items-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusColor(stage.status)} ring-2 ring-white shadow-sm`} />
                          <span className="ml-2 text-sm font-medium text-[#27548A] capitalize">{stage.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[#183B4E] text-opacity-80 leading-relaxed">{stage.description}</p>
                    </div>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="flex justify-center my-4">
                    <svg className="w-5 h-5 text-[#DDA853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Website Features */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[#183B4E] mb-2">Website Features</h2>
            <p className="text-lg text-[#27548A] mb-8">Current development status of website functionality</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-[#DDA853] border-opacity-20 ${getStatusBgColor(feature.status)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-[#183B4E]">{feature.title}</span>
                    <div className="flex items-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusColor(feature.status)} ring-2 ring-white shadow-sm`} />
                      <span className="ml-2 text-sm font-medium text-[#27548A] capitalize">{feature.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 