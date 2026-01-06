import React from "react";
import useAppContext from "../../hooks/state-hooks/useAppContext";
import { CLOSE } from "../../util/icons";
import SettingsForm from "./SettingsForm";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { config, onConfigChange } = useAppContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-500 text-lg hover:text-slate-700 focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>

        <SettingsForm
          data={config}
          onConfigChange={(oldValue, newValue) =>{
             onConfigChange(oldValue, newValue)
             onClose()
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
