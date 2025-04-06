import { useEffect, useRef, useState } from 'react';
import { dummyMusicXML } from '../lib/musicxml';

interface ScoreViewerProps {
  onNoteClick: (xml: string) => void;
}

export default function ScoreViewer({ onNoteClick }: ScoreViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [osmdInstance, setOsmdInstance] = useState<any>(null);

  useEffect(() => {
    const loadOSMD = async () => {
      try {
        const osmd = await import('opensheetmusicdisplay');
        if (containerRef.current) {
          const instance = new osmd.OpenSheetMusicDisplay(containerRef.current, {
            autoResize: true,
            drawTitle: true,
            backend: 'svg',
          });
          
          console.log('Loading MusicXML:', dummyMusicXML);
          await instance.load(dummyMusicXML);
          console.log('MusicXML loaded, rendering...');
          await instance.render();
          console.log('Rendering complete');
          setOsmdInstance(instance);

          // Wait for the next frame to ensure rendering is complete
          setTimeout(() => {
            try {
              console.log('OSMD instance:', instance);
              
              // Get all measures
              const measures = instance.GraphicSheet.MeasureList;
              console.log('Number of measures found:', measures?.length);

              if (measures && measures.length > 0) {
                measures.forEach((measure: any, measureIndex: number) => {
                  console.log(`Processing measure ${measureIndex}`);
                  
                  // Get all graphical elements in the measure
                  const graphicalElements = measure.graphicalElements;
                  console.log(`Measure ${measureIndex} graphical elements:`, graphicalElements?.length);

                  if (graphicalElements && graphicalElements.length > 0) {
                    graphicalElements.forEach((element: any) => {
                      // Check if this is a note
                      if (element.sourceNote) {
                        console.log('Found note:', element.sourceNote);
                        
                        // Get the SVG element for this note
                        const svgElement = element.svgElement;
                        if (svgElement) {
                          // Clone the element to remove any existing listeners
                          const newSvgElement = svgElement.cloneNode(true);
                          svgElement.parentNode?.replaceChild(newSvgElement, svgElement);
                          
                          // Add pointer cursor to make it clear it's clickable
                          (newSvgElement as HTMLElement).style.cursor = 'pointer';

                          // Add click event listener
                          newSvgElement.addEventListener('click', (e: MouseEvent) => {
                            e.stopPropagation();
                            console.log('Note clicked!', element.sourceNote);
                            
                            const note = element.sourceNote;
                            const mockNoteXML = `<note>
  <pitch>
    <step>${note.pitch.step}</step>
    <octave>${note.pitch.octave}</octave>
  </pitch>
  <duration>${note.length.value}</duration>
  <type>${note.length.type}</type>
</note>`;
                            console.log('Sending note XML:', mockNoteXML);
                            onNoteClick(mockNoteXML);
                          });
                        }
                      }
                    });
                  }
                });
              }
            } catch (error) {
              console.error('Error accessing notes:', error);
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error loading OSMD:', error);
      }
    };

    loadOSMD();

    // Cleanup
    return () => {
      if (osmdInstance) {
        osmdInstance.clear();
      }
    };
  }, [onNoteClick]);

  return (
    <div className="w-full h-full p-4">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
} 