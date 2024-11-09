"use client";

import SetHearingDialog from "@/dialog/SetHearingDialog";
import VisitReportDialog from "@/dialog/VisitReportDialog";
import { supabase } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";

const itemsPerPage = 10;

const SetInvestigation = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from("hearingIncident")
          .select("*")
          .eq("setForHearing", "For Hearing");

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
        new Date(b.forHearing).getTime() - new Date(a.forHearing).getTime()
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div>
        {currentData.map((cases) => (
          <div className="flex justify-between border-b-2" key={cases.id}>
            <div className="flex py-5">
              <div></div>
              <div className="pl-2 w-[20em]">
                <p className="font-bold text-lg mb-2">{cases.sentBy}</p>
                <span className="font-normal text-base text-blue-500">
                  For hearing: {format(parseISO(cases.forHearing), "MM/dd/yyyy")}{" "}
                  &nbsp;
                  {formatDistanceToNow(parseISO(cases.forHearing), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="m-auto">
                <p
                  className={`text-sm text-white m-auto rounded-full px-4 py-1 ml-6 ${
                    cases.setForHearing === "Hearing"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  {cases.setForHearing === "Hearing" ? "Hearing" : "For Hearing"}
                </p>
              </div>
            </div>
            <div className="my-auto">
              <SetHearingDialog
                caseId={cases.id}
                fullName={cases.studentName}
                incidentReport={cases.incidentReport}
                offenseType={cases.offenseType}
                newReport={cases.newReport}
                created_at={cases.created_at}
                sentBy={cases.sentBy} 
              ></SetHearingDialog>
              
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

export default SetInvestigation;
