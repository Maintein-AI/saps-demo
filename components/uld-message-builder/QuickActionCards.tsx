import Link from "next/link";
import { FilePlus, ClipboardCheck, FileSearch, Upload, Search, ListFilter } from "lucide-react";

interface ActionCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  href?: string;
}

const actions: ActionCard[] = [
  {
    title: "Create UCM",
    description: "Build a ULD Control Message",
    icon: <FilePlus size={22} />,
    color: "#1B4F8B",
    bg: "#DBEAFE",
    href: "/uld-message-builder/ucm",
  },
  {
    title: "Create SCM",
    description: "Build a Stock Check Message",
    icon: <ClipboardCheck size={22} />,
    color: "#16A34A",
    bg: "#DCFCE7",
    href: "/uld-message-builder/scm",
  },
  {
    title: "Open LUC",
    description: "Open the existing LUC message builder",
    icon: <FileSearch size={22} />,
    color: "#D97706",
    bg: "#FEF3C7",
    href: "/uld-message-builder/luc",
  },
  {
    title: "Import ULDs",
    description: "Import ULD data from external source",
    icon: <Upload size={22} />,
    color: "#7C3AED",
    bg: "#EDE9FE",
    href: "/uld-message-builder/import-ulds",
  },
  {
    title: "Search Messages",
    description: "Search across all message types",
    icon: <Search size={22} />,
    color: "#0891B2",
    bg: "#CFFAFE",
    href: "/uld-message-builder/search",
  },
  {
    title: "View Message Logs",
    description: "Browse complete message history",
    icon: <ListFilter size={22} />,
    color: "#64748B",
    bg: "#F1F5F9",
    href: "/uld-message-builder/message-log",
  },
];

export default function QuickActionCards() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const content = (
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-white hover:shadow-md hover:border-[#CBD5E1] cursor-pointer transition-all text-left group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: action.bg }}
              >
                <div style={{ color: action.color }}>{action.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#0F172A] mb-0.5">{action.title}</p>
                <p className="text-[12px] text-[#64748B]">{action.description}</p>
              </div>
            </div>
          );
          return action.href ? (
            <Link key={action.title} href={action.href} className="no-underline">
              {content}
            </Link>
          ) : (
            <button key={action.title}>
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}