import { useEffect, useRef, useState } from "react";
import { LOADING } from "../util/icons";

export default function FileInput({
  label,
  onChange,
}: {
  label: string;
  onChange?: (files: FileList | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    const handleCancel = () => {
      setIsOpening(false);
    };

    input.addEventListener("cancel", handleCancel);

    return () => input.removeEventListener("cancel", handleCancel);
  }, []);

  return (
    <button
      className="cursor-pointer disabled:cursor-not-allowed inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200"
      disabled={isOpening}
      onClick={() => {
        setIsOpening(true);
        fileInputRef.current?.click();
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={false}
        onChange={(e) => {
          onChange?.(e.currentTarget.files);
          setIsOpening(false);
        }}
      />

      {isOpening ? (
        <span className="animate-spin inline-block">{LOADING}</span>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
