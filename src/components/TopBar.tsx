import { Bell, Camera } from "lucide-react";

type TopBarProps = {
  mode: "public" | "private";
  onCamera: () => void;
  onNotifications: () => void;
};

export function TopBar({ mode, onCamera, onNotifications }: TopBarProps) {
  return (
    <header className="topbar light">
      <button className="icon-button light" onClick={onCamera} aria-label="Open camera">
        <Camera size={20} />
      </button>
      <div className="brand-block">
        <p className="kicker">Tap</p>
        <h1>{mode === "public" ? "Discover publicly" : "Keep people privately"}</h1>
      </div>
      <button className="icon-button light" onClick={onNotifications} aria-label="Open notifications">
        <Bell size={20} />
      </button>
    </header>
  );
}
