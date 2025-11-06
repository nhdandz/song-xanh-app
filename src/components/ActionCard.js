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
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        action.completed
          ? 'bg-green-50 border-green-600 shadow-sm'
          : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
          action.completed
            ? 'border-green-600 bg-green-600'
            : 'border-gray-400'
        }`}>
          {action.completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span className={`text-base flex-1 ${action.completed ? 'text-gray-900' : 'text-gray-700'}`}>
          {action.text}
        </span>

        {action.completed && (
          <div className="ml-2">
            {showConfirmation ? (
              <div className="flex items-center">
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  disabled={isLoading}
                >
                  Xóa
                </button>
                <button
                  onClick={handleClose}
                  className="ml-2 px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="mt-2 pt-2 border-t border-red-200 text-sm text-red-700">
          Xóa hành động này? Điểm sẽ bị trừ.
        </div>
      )}
    </div>
  );
}