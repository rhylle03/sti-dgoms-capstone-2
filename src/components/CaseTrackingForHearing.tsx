"use client";

import { supabase } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";

export default function CaseTrackingForHearing({ caseId }: { caseId: string }) {
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseData = async () => {
      const { data, error } = await supabase
        .from("hearingIncident")
        .select("*")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching case data:", error);
      } else {
        setCaseData(data);
      }
      setLoading(false);
    };

    fetchCaseData();
  }, [caseId]);

  if (loading) return <p>Loading...</p>;
  if (!caseData) return <p>No case data found.</p>;

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Case Tracking</h1>
      </div>    
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
                <h2 className="font-medium">{caseData.setForHearing || "Untitled Case"}</h2>
                <div className="text-xs text-gray-400  bg-white rounded-md px-1 py-1">
                  {/* Display exact accepted date */}
                  <span>{format(new Date(caseData.forHearing), "yyyy-MM-dd")}</span>
                  {/* Display relative time below the accepted date */}
                  <div>{formatDistanceToNow(new Date(caseData.forHearing), { addSuffix: true })}</div>
                </div> 
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {caseData.typeOfIncident || "No description available."}
              </p>
             

              
            
        </div>
  );
}
