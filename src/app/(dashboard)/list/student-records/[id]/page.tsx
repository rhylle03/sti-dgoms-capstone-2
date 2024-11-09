"use client";

import Announcements from "@/components/Announcements";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import CaseTracking from "@/components/CaseTracking";



type StudentData = {
  id: string;
  studentName: string;
  caseNumber: string;
  hearingEnded: string;
  caseRecord: string;
  reportedBy: string;
  caseStatus: string;
  dateReported: string;
  caseSanction: string; // Corrected typo here
  caseResolution: string;
  caseResolutionStart: string;
  caseResolutionEnd: string;
  caseDocumentation: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US'); // This formats it as mm-dd-yyyy
};

const CaseRecordPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    if(id) {
    const fetchStudentData = async () => {
      try {
        const { data, error } = await supabase
          .from("studentRecord")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching student data:", error);
          return;
        }
      

        console.log("Fetched student data:", data); // Log data to confirm structure

        if (data) {
          setStudentData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    
    };

    fetchStudentData();
  }
  }, [id]);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-sti-yellow py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="/profile.png"
                alt=""
                width={120}
                height={120}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-2">
              <h1 className="text-xl font-semibold">{studentData?.studentName}</h1>
              <p className="text-sm font-bold text-gray-500">
                Case Number: {studentData?.caseNumber}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 font-bold flex items-center gap-2">
                <span>Hearing ended: {studentData?.hearingEnded ? formatDate(studentData.hearingEnded) : "Not available"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 font-bold flex items-center gap-2">
                  <span>Case offense: {studentData?.caseRecord}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 font-bold flex items-center gap-2">
                  <span>Reported by: {studentData?.reportedBy}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full font-bold 2xl:w-1/3 flex items-center gap-2">
                  <span>Case status: {studentData?.caseStatus}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{studentData?.dateReported? formatDate(studentData.dateReported) : "Date not available"}</h1>
                <span className="text-sm text-gray-400">Date reported</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{studentData?.caseSanction || "No suspension"} days suspension</h1>
                <span className="text-sm text-gray-400">Sanction</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{studentData?.caseResolution || "Resolution pending"}</h1>
                <span className="text-sm text-gray-400">Resolution</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{studentData?.caseResolutionStart? formatDate(studentData.caseResolutionStart) : ""} - {studentData?.caseResolutionEnd? formatDate(studentData.caseResolutionEnd) : ""}</h1>
                <span className="text-sm text-gray-400">Resolution date</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md text-xl font-bold p-4 h-[800px] overflow-auto">
          <h1>Case report documentation</h1>
          <p className="text-sm font-normal">{studentData?.caseDocumentation || "No documentation available"}</p>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        
      </div>
    </div>
  );
};

export default CaseRecordPage;
