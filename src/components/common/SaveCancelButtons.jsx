import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SaveCancelButtons = ({
  onSave,
  onCancel,
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  isSaving = false,
  saveDisabled = false,
  className = '',
}) => {
  return (
    <div className={cn('flex items-center justify-end gap-2.5 pt-4', className)}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
      )}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || saveDisabled}
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Check size={16} />
              {saveText}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SaveCancelButtons;
