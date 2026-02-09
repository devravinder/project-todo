import type { ReactNode } from "react";
import { CLOSE } from "../util/icons";

export default function ArchiveModel({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: VoidFunction;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="relative bg-slate-50 rounded-lg h-full overflow-auto py-12 px-4">
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-3 z-50 top-3 text-slate-500 text-lg hover:text-slate-700 focus:outline-none"
        >
          {CLOSE}
        </button>

        {children}
      </div>
    </div>
  );
}
