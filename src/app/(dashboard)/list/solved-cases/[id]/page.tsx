"use client";

import Announcements from "@/components/Announcements";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import FormModal from "@/components/FormModal";
import { Bell } from "lucide-react";
import SetHearingDialog from "@/dialog/SetHearingDialog";
import { CaseDocumentationDialog } from "@/dialog/CaseDocumentationDialog";
import TrackingRecordingDialog from "@/dialog/TrackingRecordingDialog";
import CaseTracking from "@/components/CaseTracking";
import CaseTrackingAction from "@/components/CaseTrackingAction";




type StudentData = {
  id: string;
  created_at: string;
  studentName: string;
  studentGrade: string;
  programCourse: string;
  studentYear: string;

  typeOfIncident: string;
  whenIncidentOccur: string;
  incidentOccured: string;
  incidentSchool: string;
  incidentWitness: string;
  assistance: string;
  incidentDescription: string;
  sentBy: string;
  caseNumber: string;
  offenderName: string;
  
  hearingEnded: string;
  caseRecord: string;
  newReport: string;
  userSession: string;

  caseSanction: string;
  caseResolution: string;
  caseResolutionStart: string;
  caseResolutionEnd: string;
  caseDocumentation: string;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US");

const CaseRecordPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const { data, error } = await supabase
        .from("solveCases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching student data:", error);
      } else {
        setStudentData(data);
      }
    };

    fetchStudentData();
  }, [id]);

  return (
    
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-sti-yellow py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-2/3 flex flex-col justify-between gap-2">
              <h1 className="text-xl font-semibold">{studentData?.sentBy}</h1>
              <p className="text-sm font-bold text-gray-500">
                Case #: <span>{studentData?.caseNumber}</span>
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 font-bold flex items-center gap-2">
                <span>Offense Type : <span>{studentData?.typeOfIncident || "Not specified"}</span></span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 font-bold flex items-center">
                <span>Program: {studentData?.studentGrade}</span>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 font-bold flex items-center gap-2">
                  <span>Offender Name : {studentData?.offenderName}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full font-bold 2xl:w-1/3 flex items-center gap-2">
                  <span>Course/Year : {studentData?.programCourse}-{studentData?.studentYear} </span>
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
                <h1 className="text-xl font-semibold">{studentData?.created_at? formatDate(studentData.created_at) : "Date not available"}</h1>
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
                <h1 className="text-xl font-semibold">{studentData?.caseSanction || "No sanction"} </h1>
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
        <div className="mt-4 bg-white border-2 border-gray-200 rounded-md text-xl font-bold p-4 h-[800px] overflow-y-auto relative">
  <h1 className="text-2xl mb-4">Narrative Report</h1>

  <div className="text-sm font-normal ml-4">
    <p className="break-words mt-20">
       {studentData?.sentBy || "N/A"}
    </p>
    <p className="break-words">
      {studentData?.created_at ? formatDate(studentData.created_at) : "N/A"}
    </p>
    <p className="break-words">
    {studentData?.typeOfIncident || "N/A"}
    </p>
    <p className="break-words mt-20">
      <strong>When Did the Incident Occur?</strong> {studentData?.whenIncidentOccur || "N/A"}
    </p>
    <p className="break-words">
      <strong>Has the Incident Occurred More Than Once?</strong> {studentData?.incidentOccured || "N/A"}
    </p>
    <p className="break-words">
      <strong>Incident Location:</strong> {studentData?.incidentSchool || "N/A"}
    </p>
    <p className="break-words">
      <strong>Was There Any Witness?</strong> {studentData?.incidentWitness || "N/A"}
    </p>
    <p className="break-words">
      <strong>Additional Assistance if Asked?</strong> {studentData?.assistance || "N/A"}
    </p>
    <p className="break-words">
      <strong>Incident Description:</strong> {studentData?.incidentDescription || "N/A"}
    </p>
</div>
    <div className="absolute top-4 right-4 font-normal text-sm">
      
       </div>
         </div>  
      </div>
      {/* RIGHT */}  
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
      {studentData && (
        <CaseTrackingAction
         caseId ={id}
        ></CaseTrackingAction>
        )}
      </div>
    </div>
    
  );
};

export default CaseRecordPage;
