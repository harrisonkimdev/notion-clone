import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { X, FolderOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Document interface
interface Document {
  id: number;
  title: string;
}

// Pile interface
interface Pile {
  id: string;
  name: string;
  documents: Document[];
}

// DocumentItem component (draggable)
const DocumentItem: React.FC<{ doc: Document }> = ({ doc }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'document',
    item: { id: doc.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={drag as any}
      className={`flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-move transition-all hover:shadow-sm ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } bg-white`}
    >
      <FileText className="h-4 w-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-700">{doc.title}</span>
    </div>
  );
};

// Pile component (droppable)
const Pile: React.FC<{ pile: Pile; onDrop: (docId: number, pileId: string) => void }> = ({
  pile,
  onDrop,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'document',
    drop: (item: { id: number }) => onDrop(item.id, pile.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={drop as any}
      className={`min-h-32 p-4 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${
        isOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen className="h-4 w-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-800">{pile.name}</h3>
        <span className="text-xs text-gray-500">({pile.documents.length})</span>
      </div>
      <div className="space-y-2">
        {pile.documents.map((doc) => (
          <DocumentItem key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
};

interface DocumentExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Main DocumentExplorer component
const DocumentExplorer: React.FC<DocumentExplorerProps> = ({ isOpen, onClose }) => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, title: 'Project Proposal.pdf' },
    { id: 2, title: 'Meeting Notes.docx' },
    { id: 3, title: 'Budget Report.xlsx' },
    { id: 4, title: 'Design Mockups.fig' },
    { id: 5, title: 'Code Review.md' },
  ]);
  
  const [piles, setPiles] = useState<Pile[]>([
    { id: 'pile1', name: 'Work Projects', documents: [] },
    { id: 'pile2', name: 'Personal', documents: [] },
    { id: 'pile3', name: 'Archive', documents: [] },
  ]);

  const handleDrop = (docId: number, pileId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setPiles((prevPiles) =>
      prevPiles.map((pile) =>
        pile.id === pileId
          ? { ...pile, documents: [...pile.documents, doc] }
          : pile
      )
    );
    setDocuments((prevDocs) => prevDocs.filter((d) => d.id !== docId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Document Explorer</h2>
            <p className="text-sm text-gray-600 mt-1">
              Organize your documents into piles using drag and drop
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <DndProvider backend={HTML5Backend}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Documents</h3>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <DocumentItem key={doc.id} doc={doc} />
                  ))}
                  {documents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>All documents have been organized!</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Piles</h3>
                <div className="space-y-4">
                  {piles.map((pile) => (
                    <Pile key={pile.id} pile={pile} onDrop={handleDrop} />
                  ))}
                </div>
              </div>
            </div>
          </DndProvider>
        </div>
      </div>
    </div>
  );
};

export default DocumentExplorer;