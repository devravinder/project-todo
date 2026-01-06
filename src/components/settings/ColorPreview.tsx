import { memo } from "react";

export const ColorPreview = memo(({ label, color }: { label: string; color: Color }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <span>{label}</span>
      <div className="inline-flex text-xs px-4 py-2 rounded-md border border-slate-300">
        <span
          className="text-xs py-1 px-2 rounded-md whitespace-nowrap"
          style={{
            backgroundColor: color["bg-color"],
            color: color["text-color"],
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
});