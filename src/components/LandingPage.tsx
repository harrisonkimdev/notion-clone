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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={drag as any}
      className={`p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 cursor-move transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'
        }`}
    >
      <div className="text-sm font-medium">{doc.title}</div>
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
      className={`min-h-32 p-4 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 transition-colors duration-200 ${
        isOver ? 'bg-gray-100 dark:bg-gray-700 border-blue-400 dark:border-blue-500' : ''
      }`}
    >
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        {pile.name}
      </h3>
      <div className="space-y-2">
        {pile.documents.map((doc) => (
          <DocumentItem key={doc.id} doc={doc} />
        ))}
      </div>
      {pile.documents.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          Drop documents here
        </div>
      )}
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
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Document Organization
        </h1>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              All Documents
            </h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Piles
            </h2>
            <div className="space-y-4">
              {piles.map((pile) => (
                <Pile key={pile.id} pile={pile} onDrop={handleDrop} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              All Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Piles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
