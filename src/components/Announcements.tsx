"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { formatDistanceToNow, format } from "date-fns"; // Import both formatting functions

const Announcements = ({ userSession }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from("ongoingCases")
          .select("*");

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setData(fetchedData || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading cases...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.length > 0 ? (
          data.map((caseData) => (
            <div
              key={caseData.id}
              className={`p-4 rounded-md ${
                caseData.newReport === "Pending"
                  ? "bg-sti-blue"
                  : caseData.newReport === "Accepted"
                  ? "bg-st-yellow"
                  : "bg-sti-blue"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{caseData.newReportStatus || "Untitled Case"}</h2>
                <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {/* Display exact date */}
                  <span>{format(new Date(caseData.created_at), "yyyy-MM-dd")}</span>
                  {/* Display relative time below the date */}
                  <div className="text-blue-500">{formatDistanceToNow(new Date(caseData.created_at), { addSuffix: true })}</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {caseData.typeOfIncident || "No description available."}
              </p>

              <div className="flex items-center justify-between mt-5">
                <h2 className="font-medium">{caseData.newReport || "Untitled Case"}</h2>
                <div className="text-xs text-gray-400  bg-white rounded-md px-1 py-1">
                  {/* Display exact accepted date */}
                  <span>{format(new Date(caseData.acceptedDate), "yyyy-MM-dd")}</span>
                  {/* Display relative time below the accepted date */}
                  <div>{formatDistanceToNow(new Date(caseData.acceptedDate), { addSuffix: true })}</div>
                </div> 
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {caseData.typeOfIncident || "No description available."}
              </p>
              <div className="flex items-center justify-between mt-5">
                <h2 className="font-medium">{caseData.setForHearing || ""}</h2>
                <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {/* Display exact accepted date */}
                  <span>{format(new Date(caseData.forHearing), "yyyy-MM-dd")}</span>
                  {/* Display relative time below the accepted date */}
                  <div className="text-blue-500">{formatDistanceToNow(new Date(caseData.forHearing), { addSuffix: true }) || ""}</div>
                </div> 
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {caseData.typeOfIncident || "No description available."}
              </p>

              <div className="flex items-center justify-between mt-5">
                <h2 className="font-medium">{caseData.setForHearing || ""}</h2>
                <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {/* Display exact accepted date */}
                  <span>{format(new Date(caseData.forHearing), "yyyy-MM-dd")}</span>
                  {/* Display relative time below the accepted date */}
                  <div className="text-blue-500">{formatDistanceToNow(new Date(caseData.forHearing), { addSuffix: true }) || ""}</div>
                </div> 
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {caseData.typeOfIncident || "No description available."}
              </p>
              

            </div>
          ))
        ) : (
          <p>No cases found.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
