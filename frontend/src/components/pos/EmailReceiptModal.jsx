import React, { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "react-hot-toast";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { emailReceiptApi } from "../../api/order.api";

export const EmailReceiptModal = ({ isOpen, onClose, orderId, defaultEmail = "" }) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail || "");
    }
  }, [isOpen, defaultEmail]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    try {
      const res = await emailReceiptApi(orderId, email.trim());
      if (res.success) {
        toast.success("Receipt emailed successfully via Ethereal SMTP!");
        onClose();
      } else {
        toast.error(res.message || "Failed to send email");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error mailing receipt");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Receipt"
      size="sm"
    >
      <form onSubmit={handleSendEmail} className="flex flex-col gap-4 select-none">
        <p className="text-xs text-cafe-text-muted">
          Provide the customer's email address below to send them an HTML styled receipt of their transaction.
        </p>

        <div className="relative">
          <Input
            label="Email Address *"
            type="email"
            placeholder="customer@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSending}
            required
          />
          <span className="absolute right-3.5 top-9.5 text-cafe-text-muted">
            <Mail size={16} />
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSending}>
            Send Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmailReceiptModal;
