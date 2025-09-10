import React, { useState } from 'react';
import { Search, FolderOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentExplorer from './DocumentExplorer';
import ChatInterface from './ChatInterface';

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
    // For now, just clear the search
    setSearchQuery('');
  };

  const suggestions = [
    'Find project documents',
    'Organize meeting notes',
    'Search recent files',
    'Create new document pile'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <FolderOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pile Hive
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Organize, search, and manage your documents with intelligent pile-based organization
          </p>
        </div>

        {/* Search Interface */}
        <div className="w-full max-w-2xl mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents, ask questions, or get help organizing..."
                className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg bg-white"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Search Suggestions */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(suggestion)}
                className="px-4 py-2 text-sm text-gray-600 bg-white rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button
            onClick={() => setIsExplorerOpen(true)}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 text-base bg-white border-gray-300 hover:bg-gray-50"
          >
            <FolderOpen className="h-4 w-4" />
            Open Document Explorer
          </Button>
          <Button
            className="flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Create New Pile
          </Button>
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            AI Assistant
          </h2>
          <p className="text-gray-600 text-center">
            Get help organizing your documents, finding files, or managing your workspace
          </p>
        </div>
        <ChatInterface />
      </div>

      {/* Document Explorer Modal */}
      <DocumentExplorer 
        isOpen={isExplorerOpen} 
        onClose={() => setIsExplorerOpen(false)} 
      />

    </div>
  );
};

export default LandingPage;