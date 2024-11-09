import Menu from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";


interface SidebarItemProps {
  icon?: React.JSX.Element;
  text: string;
  active?: boolean;
  redirect: string;
  onClick?: () => void;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-sti-blue p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR43odZn5z8q5EV2OEZLNns5GzxIIW_iTVNLA&s"
              alt=""
              width={50}
              height={50} />
          <span className="hidden lg:block text-white font-bold">STI Disciplinary Guidance Office Management System</span>
        </Link>
        <Sidebar></Sidebar>
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}


