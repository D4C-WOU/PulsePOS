import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" closeOnOverlayClick={!isLoading}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDanger ? "bg-red-900/30 text-cafe-danger" : "bg-amber-900/30 text-cafe-warning"}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="text-sm text-cafe-text-muted">{message}</p>
        <div className="flex justify-center gap-3 w-full mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
