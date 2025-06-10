'use client'
import React, { useState } from 'react';
import axios from 'axios';

interface SegmentRule {
  field: string;
  operator: string;
  value: string | number | boolean | object;
}

interface SegmentResponse {
  segment: {
    segmentRule: SegmentRule[];
    name: string;
    audienceSize: number;
  };
}

const SegmentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [generatedRules, setGeneratedRules] = useState<SegmentRule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await axios.post<SegmentResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/rule-generator`,
        { prompt, name }
      );
      
      setGeneratedRules(response.data.segment.segmentRule);
      setSuccess(true);
    } catch (err) {
      setError(axios.isAxiosError(err) 
        ? err.response?.data?.error || 'Failed to generate segment' 
        : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="segment-generator space-y-4 max-w-2xl mx-auto p-6 rounded-lg bg-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400">Generate Segment from Text</h2>
      
      <div className="form-group space-y-2">
        <label className="block text-sm font-medium text-gray-300">Segment Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="My Custom Segment"
          className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>
      
      <div className="form-group space-y-2">
        <label className="block text-sm font-medium text-gray-300">Describe your segment:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Users aged over 30 from New York who purchased in the last month"
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>
      
      <button 
        onClick={handleGenerate} 
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isLoading 
            ? 'bg-teal-700 cursor-not-allowed' 
            : 'bg-teal-600 hover:bg-teal-500'
        } focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : 'Generate Segment'}
      </button>
      
      {error && (
        <div className="p-3 mt-4 text-sm text-red-300 bg-red-900/50 rounded-md border border-red-700">
          <svg className="inline mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 mt-4 text-sm text-green-300 bg-green-900/50 rounded-md border border-green-700">
          <svg className="inline mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Segment generated successfully!
        </div>
      )}
      
      {generatedRules.length > 0 && (
        <div className="generated-rules mt-6 p-4 bg-gray-700/50 rounded-md border border-gray-600">
          <h3 className="text-lg font-medium text-teal-300 mb-3">Generated Rules:</h3>
          <ul className="space-y-2">
            {generatedRules.map((rule, index) => (
              <li key={index} className="p-3 bg-gray-700 rounded-md border-l-4 border-teal-500">
                <span className="font-semibold text-teal-400">{rule.field}</span>{' '}
                <span className="text-gray-400">{rule.operator}</span>{' '}
                <span className="font-medium text-teal-300">
                  {typeof rule.value === 'object' ? JSON.stringify(rule.value) : rule.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SegmentGenerator;
