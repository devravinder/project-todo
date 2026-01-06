import { memo } from "react";
import { ColorPreview } from "./ColorPreview";
import { ColorPicker } from "./ColorPicker";


type ColorInputGroupProps = {
  label?: string;
  color?: Color;
  onChange: (color: Color) => void;
};

// Main Component
const ColorInputGroup = ({
  color = { "text-color": "#ffffff", "bg-color": "#3b82f6" },
  label = "Label",
  onChange,
}: ColorInputGroupProps) => {
  const updateColor = (key: keyof Color, value: string) => {
    onChange({ ...color, [key]: value });
  };

  return (
    <div className="w-full flex flex-row items-start gap-4">
      <ColorPreview label={label} color={color} />

      <ColorPicker
        label="Text Color"
        value={color["text-color"]}
        onChange={(val) => updateColor("text-color", val)}
      />

      <ColorPicker
        label="Bg Color"
        value={color["bg-color"]}
        onChange={(val) => updateColor("bg-color", val)}
      />
    </div>
  );
};

export default memo(ColorInputGroup);