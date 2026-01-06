import { memo, type ChangeEvent } from "react";

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const ColorPicker = memo(({ label, value, onChange }: ColorPickerProps) => {
  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleHexInput = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#")) {
      val = "#" + val;
    }
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <span>{label}</span>
      <div className="flex flex-row gap-2 items-center justify-between px-4 py-2 rounded-md border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 min-w-0">
        <input
          type="color"
          value={value}
          onChange={handleColorPickerChange}
          className="appearance-none w-6 h-6 rounded-md border border-gray-300 cursor-pointer p-0"
        />
        <input
          type="text"
          value={value}
          onChange={handleHexInput}
          placeholder="#000000"
          className="flex-1 min-w-0 px-4 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
});