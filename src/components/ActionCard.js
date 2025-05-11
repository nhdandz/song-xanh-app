'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function ActionCard({ action, onChange }) {
  const { deleteActivity, isLoading } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa đến phần tử cha
    
    if (showConfirmation) {
      const success = await deleteActivity(action.id);
      if (success) {
        setShowConfirmation(false);
      }
    } else {
      setShowConfirmation(true);
    }
  };
  
  const handleClick = () => {
    if (!showConfirmation) {
      onChange(!action.completed);
    }
    setShowConfirmation(false);
  };
  
  const handleClose = (e) => {
    e.stopPropagation();
    setShowConfirmation(false);
  };
  
  return (
    <div 
      className={`p-4 rounded-lg shadow-sm border-2 transition-all ${
        action.completed 
          ? 'bg-green-50 border-green-500' 
          : 'bg-white border-gray-200'
      }`}
      onClick={handleClick}
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
        <span className={`text-lg flex-1 ${action.completed ? 'text-green-800' : 'text-gray-700'}`}>
          {action.text}
        </span>
        
        {action.completed && (
          <div className="ml-2">
            {showConfirmation ? (
              <div className="flex items-center">
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                  disabled={isLoading}
                >
                  <FaTrash size={12} />
                </button>
                <button
                  onClick={handleClose}
                  className="ml-2 p-1 text-sm text-gray-600"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={handleDelete}
                className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
        )}
      </div>
      
      {showConfirmation && (
        <div className="mt-2 text-sm text-red-600">
          Xóa hoạt động này? Điểm xanh sẽ bị trừ đi.
        </div>
      )}
    </div>
  );
}