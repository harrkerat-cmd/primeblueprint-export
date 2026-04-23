import { Globe, MessageCircle, Newspaper, Search, User } from "lucide-react";

type MainTab = "news" | "home" | "search" | "messages" | "profile";

type BottomNavProps = {
  activeTab: MainTab;
  onSelect: (tab: MainTab) => void;
};

export function BottomNav({ activeTab, onSelect }: BottomNavProps) {
  return (
    <nav className="bottom-nav light">
      <button className={activeTab === "news" ? "tab-active" : ""} onClick={() => onSelect("news")}><Newspaper size={18} /><span>News</span></button>
      <button className={activeTab === "home" ? "tab-active" : ""} onClick={() => onSelect("home")}><Globe size={18} /><span>Home</span></button>
      <button className={activeTab === "search" ? "tab-active" : ""} onClick={() => onSelect("search")}><Search size={18} /><span>Search</span></button>
      <button className={activeTab === "messages" ? "tab-active" : ""} onClick={() => onSelect("messages")}><MessageCircle size={18} /><span>Messages</span></button>
      <button className={activeTab === "profile" ? "tab-active" : ""} onClick={() => onSelect("profile")}><User size={18} /><span>Profile</span></button>
    </nav>
  );
}
