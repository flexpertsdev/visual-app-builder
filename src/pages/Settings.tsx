import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Key, AlertCircle, Check } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { AIService } from '../services/aiService';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key') || '';
    setApiKey(savedKey);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    localStorage.setItem('openai_api_key', apiKey);
    
    // Reinitialize AI service with new key
    const aiService = AIService.getInstance();
    await aiService.initialize(apiKey);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    
    try {
      const aiService = AIService.getInstance();
      await aiService.initialize(apiKey);
      
      if (aiService.isConfigured) {
        // Try a simple test request
        const response = await aiService.generateComponent('Test connection', {
          content: '',
          style: {},
          interactions: []
        });
        
        if (response) {
          setTestResult({ success: true, message: 'Connection successful!' });
        } else {
          setTestResult({ success: false, message: 'Connection failed. Please check your API key.' });
        }
      } else {
        setTestResult({ success: false, message: 'API key is not configured properly.' });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection failed' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              Back
            </Button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">API Configuration</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    id="api-key"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSave}
                icon={saveSuccess ? Check : Save}
                disabled={isSaving}
                className={saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTestConnection}
                icon={Key}
              >
                Test Connection
              </Button>
            </div>

            {testResult && (
              <div className={`flex items-start space-x-2 p-4 rounded-lg ${
                testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium">{testResult.success ? 'Success' : 'Error'}</p>
                  <p className="text-sm">{testResult.message}</p>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">How to get an API key:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a></li>
                <li>Sign in or create an account</li>
                <li>Navigate to API keys in your account settings</li>
                <li>Create a new secret key</li>
                <li>Copy the key and paste it above</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About AI Integration</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              The AI assistant helps you create UI components by understanding your natural language descriptions.
              When configured with a valid OpenAI API key, it can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Generate screen layouts based on your descriptions</li>
              <li>Create appropriate UI components for your needs</li>
              <li>Suggest design improvements and best practices</li>
              <li>Help with navigation flow and user experience</li>
            </ul>
            <p>
              Without an API key, the assistant will use mock responses with limited functionality,
              responding to keywords like "login", "dashboard", "home", etc.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};