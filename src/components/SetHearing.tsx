"use client";

import ForHearingDialog from "@/dialog/ForHearingDialog";
import SetHearingDialog from "@/dialog/SetHearingDialog";
import VisitReportDialog from "@/dialog/VisitReportDialog";
import { supabase } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";

const itemsPerPage = 10;

const CaseReport = ({ userSession }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from("acceptedReport")
          .select("*");
        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setData(fetchedData || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  
  const totalPages = Math.ceil(data.length / itemsPerPage);

  
  const currentData = data
    .sort(
      (a, b) =>
        new Date(b.acceptedDate).getTime() - new Date(a.acceptedDate).getTime()
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div>
        {currentData.map((cases) => (
          <div className="flex justify-between border-b-2" key={cases.id}>
            <div className="flex py-5">
              <div></div>
              <div className=" w-[20em]">
                <p className="font-bold text-lg mb-2">{cases.sentBy}</p>
                <span className="font-bold text-black">
                  Accepted: </span>
                <span className="font-normal text-base text-blue-500">
                   {format(parseISO(cases.acceptedDate), "MM-dd-yyyy")}{" "}
                  &nbsp;
                  {formatDistanceToNow(parseISO(cases.acceptedDate), {
                    addSuffix: true,
                  })}
                </span>
                <p>Incident Report</p>
              </div>
              <div className="m-auto">
                <p
                  className={`text-sm text-white rounded-full px-4 py-1 ml-6 ${
                    cases.newReport === "Denied"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {cases.newReport === "Denied" ? "Denied" : "Accepted"}
                </p>
              </div>
            </div>
            <div className="my-auto">
              <ForHearingDialog
                caseId={cases.id}
                fullName={cases.studentName}
                offenderName={cases.offenderName}
                studentGrade={cases.studentGrade}
                programCourse={cases.programCourse}
                studentYear={cases.studentYear}
                typeOfIncident={cases.typeOfIncident}
                whenIncidentOccur={cases.whenIncidentOccur}
                incidentOccured={cases.incidentOccured}
                incidentSchool={cases.incidentSchool}
                incidentWitness={cases.incidentWitness}
                assistance={cases.assistance}
                incidentDescription={cases.incidentDescription}
                created_at={cases.created_at}
                sentBy={cases.sentBy}
                newReport={cases.newReport}
                userSession={userSession}
              ></ForHearingDialog>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CaseReport;

const CaseBoxes = async () => {
  try {
    const { data: ongoingCasesData, error: ongoingCasesError } = await supabase
      .from("ongoingCases")
      .select("id, incidentStatus")
      .in("incidentStatus", ["Ongoing", "Solved"]);

    const { data: allCasesData, error: allCasesError } = await supabase
      .from("cases")
      .select("id, offenseType")
      .in("offenseType", ["Minor", "Major"]);

    // Filter the data
    const minorCount = allCasesData?.filter(
      (item) => item.offenseType === "Minor"
    ).length;
    const majorCount = allCasesData?.filter(
      (item) => item.offenseType === "Major"
    ).length;
    const ongoingCount = ongoingCasesData?.filter(
      (item) => item.incidentStatus === "Ongoing"
    ).length;

    return (
      <>
        <div className="box bg-green-900 text-white w-[20em] h-[15em]">
          <p>Ongoing Cases </p>
          <p className="pt-5 text-6xl"> {ongoingCount} </p>
        </div>
        <div className="box bg-orange-500 w-[20em] h-[15em]">
          <p>Minor Offenses </p>
          <p className="pt-5 text-6xl"> {minorCount} </p>
        </div>
        <div className="box bg-black text-white w-[20em] h-[15em]">
          <p>Major Offenses</p>
          <p className="pt-5 text-6xl"> {majorCount} </p>
        </div>
      </>
    );
  } catch (err) {
    console.log(err);
  }
};

export { CaseBoxes };
