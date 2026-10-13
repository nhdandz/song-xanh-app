'use client';

import { useState } from 'react';
import { FaTrash, FaCheck } from 'react-icons/fa';
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
      role="checkbox"
      tabIndex={0}
      aria-checked={action.completed}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`sx-tap p-4 rounded-card border-[1.5px] cursor-pointer select-none ${
        action.completed
          ? 'bg-brand-wash border-brand'
          : 'bg-paper border-line hover:border-brand'
      }`}
      style={{ boxShadow: action.completed ? '0 3px 0 0 #bfe0ca' : 'var(--shadow-pop)' }}
    >
      <div className="flex items-center gap-3">
        {/* Ô tick to, dễ bấm trên điện thoại */}
        <span
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
            action.completed ? 'border-brand bg-brand' : 'border-ink-faint bg-white'
          }`}
        >
          {action.completed && <FaCheck className="text-white" size={12} />}
        </span>

        <span
          className={`flex-1 font-semibold leading-snug ${
            action.completed ? 'text-brand-dark' : 'text-ink-soft'
          }`}
        >
          {action.text}
        </span>

        {action.completed && (
          <span className="ml-1 shrink-0">
            {showConfirmation ? (
              <span className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="px-2.5 py-1 bg-coral text-white text-xs font-bold rounded-pill hover:opacity-90 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Xóa
                </button>
                <button
                  onClick={handleClose}
                  className="px-1 text-xs font-bold text-ink-faint hover:text-ink"
                >
                  Hủy
                </button>
              </span>
            ) : (
              <button
                onClick={handleDelete}
                aria-label="Xóa hành động"
                className="p-2 text-ink-faint hover:text-coral transition-colors"
              >
                <FaTrash size={13} />
              </button>
            )}
          </span>
        )}
      </div>

      {showConfirmation && (
        <p className="mt-2.5 pt-2.5 border-t border-coral/30 text-sm font-medium text-coral">
          Xóa hành động này? Điểm sẽ bị trừ.
        </p>
      )}
    </div>
  );
}
