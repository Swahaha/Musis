'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import UploadPanel from '../components/UploadPanel';
import ScoreViewer from '../components/ScoreViewer';
import NotePopup from '../components/NotePopup';
import Link from 'next/link';

// Dummy  XML content
export const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>G</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>5</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
    <measure number="2">
      <note>
        <pitch>
          <step>G</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>3</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

export default function Home() {
  const { data: session } = useSession();
  const [selectedNoteXml, setSelectedNoteXml] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const scoreViewerRef = useRef<HTMLDivElement>(null);

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

  const handleExportXML = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'score.musicxml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setShowExportMenu(false);
  };

  const handleExportPDF = async () => {
    if (!scoreViewerRef.current) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = scoreViewerRef.current;
      const opt = {
        margin: 1,
        filename: 'score.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };

      await html2pdf().set(opt).from(element).save();
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleExportMIDI = async () => {
    try {
      const { Midi } = await import('@tonejs/midi');
      
      // Create a new MIDI file
      const midi = new Midi();
      
      // Add a track
      const track = midi.addTrack();
      
      // Parse the XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Get all measures
      const measures = xmlDoc.getElementsByTagName('measure');
      let currentTime = 0;
      const PPQ = 480; // Pulses per quarter note (standard MIDI resolution)
      
      // Process each measure
      for (let i = 0; i < measures.length; i++) {
        const measure = measures[i];
        const notes = measure.getElementsByTagName('note');
        
        // Process each note in the measure
        for (let j = 0; j < notes.length; j++) {
          const note = notes[j];
          const pitch = note.getElementsByTagName('pitch')[0];
          const duration = note.getElementsByTagName('duration')[0];
          
          if (pitch && duration) {
            const step = pitch.getElementsByTagName('step')[0].textContent;
            const octave = parseInt(pitch.getElementsByTagName('octave')[0].textContent || '4');
            const noteDuration = parseInt(duration.textContent || '1');
            
            // Convert note name to MIDI number
            const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            const noteIndex = noteNames.indexOf(step || 'C');
            const midiNumber = 12 + (octave * 12) + noteIndex;
            
            // Add note to MIDI track
            track.addNote({
              midi: midiNumber,
              time: currentTime,
              duration: noteDuration,
              velocity: 0.8
            });
            
            // Update current time
            currentTime += noteDuration;
          }
        }
      }

      // Convert to ArrayBuffer
      const arrayBuffer = midi.toArray();
      
      // Create blob and download
      const blob = new Blob([arrayBuffer], { type: 'audio/midi' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'score.mid';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error generating MIDI:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Bar */}
      <nav className="bg-[#183B4E] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-[#F5EEDC]">Musis</h1>
                <p className="ml-2 text-sm text-[#F5EEDC] text-opacity-80">Optical Music Recognition</p>
              </div>
              <Link 
                href="/progress" 
                className="text-[#F5EEDC] hover:bg-[#27548A] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Progress
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#F5EEDC]">
                      Hey {session.user?.name || session.user?.email}!
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 bg-[#DDA853] text-[#183B4E] rounded-md hover:bg-[#DDA853] hover:bg-opacity-80 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-[#27548A] text-[#F5EEDC] rounded-md hover:bg-opacity-80 transition-all duration-200"
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
        <div className="w-1/2 border-r border-[#DDA853] border-opacity-20">
          <UploadPanel onFileUpload={handleFileUpload} />
        </div>
        <div className="w-1/2 relative">
          {hasUploadedFile ? (
            <div className="h-full flex flex-col">
              <div className="p-4 flex justify-end" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-4 py-2 bg-[#27548A] text-[#F5EEDC] rounded-md hover:bg-opacity-80 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Download</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showExportMenu && (
                  <div className="absolute right-4 top-16 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-[#DDA853] border-opacity-20">
                    <button
                      onClick={handleExportPDF}
                      className="block w-full text-left px-4 py-2 text-sm text-[#183B4E] hover:bg-[#F5EEDC] hover:bg-opacity-30"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={handleExportXML}
                      className="block w-full text-left px-4 py-2 text-sm text-[#183B4E] hover:bg-[#F5EEDC] hover:bg-opacity-30"
                    >
                      Export as MusicXML
                    </button>
                    <button
                      onClick={handleExportMIDI}
                      className="block w-full text-left px-4 py-2 text-sm text-[#183B4E] hover:bg-[#F5EEDC] hover:bg-opacity-30"
                    >
                      Export as MIDI
                    </button>
                  </div>
                )}
              </div>
              <div ref={scoreViewerRef}>
                <ScoreViewer onNoteClick={handleNoteClick} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#27548A]">
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