import React from "react";
import useAppContext from "../../hooks/state-hooks/useAppContext";
import { clearDataWithPrompt } from "../../util/db";
import { CLOSE } from "../../util/icons";
import SettingsForm from "./SettingsForm";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { config, onConfigChange } = useAppContext();

  if (!isOpen) return null;

  const onResetClick = () => {
    clearDataWithPrompt(
      "This removes every project and all browser-stored tasks, then restarts the app.\n\n" +
        "Do you want to continue?"
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground text-lg hover:text-foreground focus:outline-none"
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

        <div className="w-full flex flex-col gap-2 p-4 px-6 border-t border-border">
          <h3 className="text-sm font-semibold text-red-500">Danger Zone</h3>
          <p className="text-xs text-muted-foreground">
            Removes every project (local folder and browser storage) and all
            browser-stored tasks, then restarts the app. Files on disk
            (todo.md / todo.json) are not deleted.
          </p>
          <button
            type="button"
            onClick={onResetClick}
            className="self-start cursor-pointer px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
          >
            Reset App Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
