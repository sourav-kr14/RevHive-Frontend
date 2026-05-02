import { useState } from "react";
import api from "../services/api";

const reasons = [
  "I don’t like it",
  "Bullying",
  "Violence",
  "Spam",
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
}) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleReport = async (reason) => {
    try {
      await api.post("/reports", {
        targetType,
        targetId,
        reason,
      });

      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0f172a] p-6 rounded-xl w-96">

        {step === 1 && (
          <>
            <h2 className="mb-4">Report {targetType}</h2>
            {reasons.map((r, i) => (
              <button
                key={i}
                onClick={() => handleReport(r)}
                className="block w-full text-left p-2 hover:bg-white/10"
              >
                {r}
              </button>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h2>Thanks for your feedback</h2>
            <button onClick={onClose}>Done</button>
          </>
        )}
      </div>
    </div>
  );
}