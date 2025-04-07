'use client';

import { useEffect, useRef, useState } from 'react';
import { xmlContent } from '../app/page';

interface ScoreViewerProps {
  onNoteClick: (xml: string) => void;
}

interface GraphicalMeasure {
  graphicalElements?: Array<{
    sourceNote?: {
      toXMLString: () => string;
    };
    svgElement?: HTMLElement;
  }>;
}

const ScoreRenderer = ({ containerId, onNoteClick }: { containerId: string; onNoteClick: (xml: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<any>(null);

  useEffect(() => {
    const loadOSMD = async () => {
      if (!containerRef.current) return;

      try {
        const osmdModule = await import('opensheetmusicdisplay');
        const instance = new osmdModule.OpenSheetMusicDisplay(containerRef.current, {
          autoResize: false,
          drawTitle: true,
          backend: 'svg',
          drawComposer: false,
          drawSubtitle: false,
          drawLyricist: false,
          drawCredits: false,
          pageFormat: 'A4',
          renderSingleHorizontalStaffline: true,
          newSystemFromXML: false,
          newPageFromXML: false
        });

        // Set additional rendering options
        instance.EngravingRules.RenderMultipleRestMeasures = false;

        osmdRef.current = instance;

        await instance.load(xmlContent);
        await instance.render();

        const measures = (instance.GraphicSheet.MeasureList as unknown) as GraphicalMeasure[];
        if (measures && Array.isArray(measures)) {
          measures.forEach(measure => {
            if (measure.graphicalElements && Array.isArray(measure.graphicalElements)) {
              measure.graphicalElements.forEach(element => {
                if (element.sourceNote) {
                  const svgElement = element.svgElement;
                  if (svgElement) {
                    svgElement.style.cursor = 'pointer';
                    svgElement.addEventListener('click', () => {
                      const noteXml = element.sourceNote?.toXMLString();
                      if (noteXml) {
                        onNoteClick(noteXml);
                      }
                    });
                  }
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading score:', error);
      }
    };

    loadOSMD();

    return () => {
      if (osmdRef.current) {
        osmdRef.current.clear();
        osmdRef.current = null;
      }
    };
  }, [containerId, onNoteClick]);

  return (
    <div 
      id={containerId}
      ref={containerRef}
      style={{ 
        width: '595px',
        height: '842px',
        transform: 'scale(0.7)',
        transformOrigin: 'top center'
      }}
    />
  );
};

export default function ScoreViewer({ onNoteClick }: ScoreViewerProps) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div 
        className="overflow-auto"
        style={{ backgroundColor: 'white' }}
      >
        <ScoreRenderer key="single-score" containerId="score-container" onNoteClick={onNoteClick} />
      </div>
    </div>
  );
} 