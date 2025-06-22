import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Package, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { ExportService } from '../../services/exportService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const { currentProject } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [previewFile, setPreviewFile] = useState<string>('1-project-overview.md');
  const [files, setFiles] = useState<Record<string, string>>({});
  
  const exportService = new ExportService();
  
  const handleExport = async () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    
    try {
      // Generate all markdown files
      const generatedFiles = exportService.generateExportFiles(currentProject);
      setFiles(generatedFiles);
      
      // Create ZIP file
      const zip = new JSZip();
      const folder = zip.folder(currentProject.name.toLowerCase().replace(/\s+/g, '-'));
      
      if (folder) {
        // Add all markdown files
        Object.entries(generatedFiles).forEach(([filename, content]) => {
          folder.file(filename, content);
        });
        
        // Add package.json
        folder.file('package.json', generatePackageJson(currentProject.name));
        
        // Add README
        folder.file('README.md', generateReadme(currentProject.name));
        
        // Generate and download ZIP
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}-export.zip`);
      }
      
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };
  
  const fileDescriptions: Record<string, string> = {
    '1-project-overview.md': 'High-level project information, tech stack, and setup instructions',
    '2-user-journeys.md': 'Complete user flows with mermaid diagrams and step-by-step paths',
    '3-screens-and-flows.md': 'All screens, navigation connections, and component templates',
    '4-features-and-components.md': 'Feature implementations and reusable component code',
    '5-design-system.md': 'Complete design tokens, styles, and UI guidelines'
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold">Export Project for AI Reconstruction</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generate comprehensive markdown files that AI can use to rebuild your entire project
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* File List */}
              <div className="w-1/3 border-r border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Export Files</h3>
                <div className="space-y-2">
                  {Object.entries(fileDescriptions).map(([filename, description]) => (
                    <button
                      key={filename}
                      onClick={() => setPreviewFile(filename)}
                      className={`
                        w-full text-left p-3 rounded-lg transition-colors
                        ${previewFile === filename 
                          ? 'bg-primary-50 border border-primary-200' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{filename}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{description}</div>
                        </div>
                      </div>
                      {exportComplete && (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-6 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Preview */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Preview: {previewFile}</h3>
                  {files[previewFile] && (
                    <button
                      onClick={() => copyToClipboard(files[previewFile])}
                      className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                
                {files[previewFile] ? (
                  <pre className="bg-gray-50 rounded-lg p-4 text-xs font-mono overflow-x-auto">
                    {files[previewFile].substring(0, 1000)}...
                  </pre>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Click "Export Project" to generate preview</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {exportComplete ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Export complete! Your ZIP file has been downloaded.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Files will be packaged as a ZIP for easy sharing with AI</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`
                      px-6 py-2 rounded-lg font-medium transition-colors
                      ${isExporting
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                      }
                    `}
                  >
                    {isExporting ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Exporting...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Export Project</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function generatePackageJson(projectName: string): string {
  return JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    private: true,
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'react-scripts': '5.0.1',
      'typescript': '^4.9.5',
      'zustand': '^4.4.1',
      'tailwindcss': '^3.3.0',
      'framer-motion': '^10.16.4',
      'lucide-react': '^0.263.1',
      'react-router-dom': '^6.15.0'
    },
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject'
    },
    eslintConfig: {
      extends: ['react-app', 'react-app/jest']
    },
    browserslist: {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
    }
  }, null, 2);
}

function generateReadme(projectName: string): string {
  return `# ${projectName}

This project was exported from the Visual App Builder and contains all the necessary documentation for AI-assisted reconstruction.

## Contents

- **1-project-overview.md**: Project setup and architecture
- **2-user-journeys.md**: User flows and journey maps
- **3-screens-and-flows.md**: Screen inventory and navigation
- **4-features-and-components.md**: Feature implementations
- **5-design-system.md**: Complete design specifications

## AI Reconstruction Instructions

To rebuild this project with AI assistance:

1. Start with \`1-project-overview.md\` to understand the project structure
2. Review \`2-user-journeys.md\` to understand user flows
3. Use \`3-screens-and-flows.md\` as a blueprint for screens
4. Implement features from \`4-features-and-components.md\`
5. Apply styles from \`5-design-system.md\`

## Quick Start

\`\`\`bash
npm install
npm start
\`\`\`

The app will run on [http://localhost:3000](http://localhost:3000).
`;
}