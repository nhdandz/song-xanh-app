'use client';

export default function ActionCard({ action, onChange }) {
  return (
    <div 
      className={`p-4 rounded-lg shadow-sm border-2 transition-all ${
        action.completed 
          ? 'bg-green-50 border-green-500' 
          : 'bg-white border-gray-200'
      }`}
      onClick={() => onChange(!action.completed)}
    >
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
          action.completed 
            ? 'border-green-500 bg-green-500' 
            : 'border-gray-300'
        }`}>
          {action.completed && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </div>
        <span className={`text-lg ${action.completed ? 'text-green-800' : 'text-gray-700'}`}>
          {action.text}
        </span>
      </div>
    </div>
  );
}