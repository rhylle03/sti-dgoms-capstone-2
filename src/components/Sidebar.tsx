"use client";

import { role } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  NotepadText,
  LogOut,
  Bell,
  RefreshCw,
  CircleHelp,
  BadgePlus,
  Users,
  Scale,
  CircleCheckBig,
  SquareChartGantt,
} from "lucide-react";

const sidebarItemsDo = [
  {
    title: "MENU",
    items: [
      {
        icon: <LayoutDashboard />,
        label: "Dashboard",
        href: "/admin",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <NotepadText />,
        label: "Student Records",
        href: "/list/student-records",
        visible: ["admin", "teacher"],
      },
      {
        icon: <Bell />,
        label: "View Reports",
        href: "/list/view-report",
        visible: ["admin", "teacher"],
      },
      {
        icon: <CircleCheckBig />,
        label: "Solved Cases",
        href: "/list/solved-cases",
        visible: ["admin", "teacher"],
      },
      {
        icon: <SquareChartGantt />,
        label: "Set Hearing",
        href: "/list/set-hearing",
        visible: ["admin"],
      },
      {
        icon: <RefreshCw />,
        label: "Ongoing Cases",
        href: "/list/ongoing-cases",
        visible: ["admin", "teacher"],
      },
      {
        icon: <Scale />,
        label: "Tracking and Recording Actions",
        href: "/list/tracking-and-recording",
        visible: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <LogOut />,
        label: "Logout",
        href: "/sign-in",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="mt-4 text-sm">
      {sidebarItemsDo.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              const isActive = pathname.startsWith (item.href);

              return (
                <Link 
                  href={item.href}
                  key={item.label}
                  className={`flex items-center text-white justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md ${
                    isActive ? "bg-sti-yellow text-black" : "hover:bg-sti-yellow"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
