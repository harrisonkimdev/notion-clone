import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
      ref={drag as any}
      className={`p-2 border border-gray-300 rounded mb-2 cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'
        }`}
    >
      {doc.title}
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
      ref={drop as any}
      className={`min-h-32 p-4 border-2 border-dashed border-gray-400 rounded-lg bg-white ${isOver ? 'bg-gray-100' : ''
        }`}
    >
      <h3 className="text-lg font-semibold mb-2">{pile.name}</h3>
      {pile.documents.map((doc) => (
        <DocumentItem key={doc.id} doc={doc} />
      ))}
    </div>
  );
};

// Main LandingPage component
const LandingPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, title: 'Doc 1' },
    { id: 2, title: 'Doc 2' },
    { id: 3, title: 'Doc 3' },
    { id: 4, title: 'Doc 4' },
  ]);
  const [piles, setPiles] = useState<Pile[]>([
    { id: 'pile1', name: 'Work', documents: [] },
    { id: 'pile2', name: 'Personal', documents: [] },
    { id: 'pile3', name: 'Ideas', documents: [] },
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Landing Page - File Explorer Style</h1>
        <div className="flex gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">All Documents</h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Piles</h2>
            <div className="space-y-4">
              {piles.map((pile) => (
                <Pile key={pile.id} pile={pile} onDrop={handleDrop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default LandingPage;
