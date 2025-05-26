import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ActionIconsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewTooltip?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  disabled?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
}

const ActionIcons: React.FC<ActionIconsProps> = ({
  onView,
  onEdit,
  onDelete,
  viewTooltip = "View",
  editTooltip = "Edit",
  deleteTooltip = "Delete",
  disabled = {},
}) => {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <button
          className={`p-1.5 rounded-md transition-colors duration-200 ${
            disabled.view
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
          onClick={onView}
          disabled={disabled.view}
          title={viewTooltip}
        >
          <Eye className="w-5 h-5" />
        </button>
      )}

      {onEdit && (
        <button
          className={`p-1.5 rounded-md transition-colors duration-200 ${
            disabled.edit
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
          onClick={onEdit}
          disabled={disabled.edit}
          title={editTooltip}
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}

      {onDelete && (
        <button
          className={`p-1.5 rounded-md transition-colors duration-200 ${
            disabled.delete
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700"
          }`}
          onClick={onDelete}
          disabled={disabled.delete}
          title={deleteTooltip}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ActionIcons;
