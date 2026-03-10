export function PixelDivider({ accent = false }: { accent?: boolean }) {
  const color = accent ? "#FF6B00" : "#222222";
  return (
    <div
      className="w-full h-[2px] pixel-render"
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`,
      }}
    />
  );
}
