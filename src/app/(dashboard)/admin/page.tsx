import Announcements from "@/components/Announcements";

import { DashboardChart } from "@/components/charts/DashboardChart";
import CountChart from "@/components/StudentChart";
import EventCalendar from "@/components/EventCalendar";

import UserCard from "@/components/UserCard";
import StudentChart from "@/components/StudentChart";
import IncidentReport from "@/components/IncidentReport";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Ongoing Cases" />
          <UserCard type="Major Case" />
          <UserCard type="Minor Case" />
          <UserCard type="Total case" />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <StudentChart></StudentChart>
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <DashboardChart/>
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
        <div className="box bg-white">
          <h1 className="font-bold text-1xl">New Reports</h1>
          <p className="mb-4 text-slate-500">
            Accept or Deny reports as a valid case
          </p>
          <IncidentReport></IncidentReport>
        </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements/>
      </div>
    </div>
  );
};

export default AdminPage;
