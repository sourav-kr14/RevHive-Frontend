import { motion, AnimatePresence } from "framer-motion";
import { Flag, X } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

const reasons = [
  "I don’t like it",
  "Bullying or harassment",
  "Violence",
  "Spam or misleading",
];

export default function ReportModal({ isOpen, onClose, targetType, targetId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleReport = async (reason) => {
    try {
      setLoading(true);

      await api.post("/reports", {
        targetType,
        targetId,
        reason,
      });

      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm 
          flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-3xl 
            bg-white shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between 
              px-5 py-4 border-b border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full 
                  bg-red-100 flex items-center justify-center"
                >
                  <Flag size={18} className="text-red-500" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Report {targetType}
                  </h2>

                  <p className="text-xs text-gray-500">
                    Help us understand the issue
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {step === 1 && (
                <div className="space-y-3">
                  {reasons.map((reason, index) => (
                    <button
                      key={index}
                      disabled={loading}
                      onClick={() => handleReport(reason)}
                      className="w-full text-left px-4 py-4 rounded-2xl
                      border border-gray-200 hover:border-red-300
                      hover:bg-red-50 transition-all text-sm font-medium"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto rounded-full 
                    bg-green-100 flex items-center justify-center"
                  >
                    <Flag className="text-green-600" />
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    Report Submitted
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Thanks for helping keep the community safe.
                  </p>

                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-3 rounded-xl
                    bg-black text-white hover:opacity-90 transition"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
