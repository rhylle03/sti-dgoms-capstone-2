"use client";

import { supabase } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";

export default function CaseTrackingAction({ caseId }: { caseId: string }) {
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseData = async () => {
      const { data, error } = await supabase
        .from("ongoingCases")
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

  const currentDate = new Date();

  // Ensure that start and end dates are valid Date objects
  const hearingHasStarted = caseData.caseHearingStartDate && new Date(caseData.caseHearingStartDate) <= currentDate;
  const hearingHasEnded = caseData.caseHearingEndDate && currentDate >= new Date(caseData.caseHearingEndDate);

  // If the hearing has started, we want to show both "Hearing Started" and "Hearing Ongoing"
  const hearingIsOngoing = hearingHasStarted && !hearingHasEnded;

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Case Tracking</h1>
      </div>    

      <div className="flex items-center justify-between">
        <h2 className="font-medium">{caseData.newReportStatus || "Untitled Case"}</h2>
        <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
          <span>{format(new Date(caseData.created_at), "yyyy-MM-dd")}</span>
          <div className="text-blue-500">{formatDistanceToNow(new Date(caseData.created_at), { addSuffix: true })}</div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {caseData.typeOfIncident || "No description available."}
      </p>

      <div className="flex items-center justify-between mt-5">
        <h2 className="font-medium">{caseData.newReport || "Untitled Case"}</h2>
        <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
          <span>{format(new Date(caseData.acceptedDate), "yyyy-MM-dd")}</span>
          <div>{formatDistanceToNow(new Date(caseData.acceptedDate), { addSuffix: true })}</div>
        </div> 
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {caseData.typeOfIncident || "No description available."}
      </p>

      <div className="flex items-center justify-between mt-5">
        <h2 className="font-medium">{caseData.setForHearing || "Untitled Case"}</h2>
        <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
          <span>{format(new Date(caseData.forHearing), "yyyy-MM-dd")}</span>
          <div>{formatDistanceToNow(new Date(caseData.forHearing), { addSuffix: true })}</div>
        </div> 
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {caseData.typeOfIncident || "No description available."}
      </p>

      <div className="flex items-center justify-between mt-5">
        <h2 className="font-medium">{caseData.hearingStatus || "Untitled Case"}</h2>
        <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
          <span>{format(new Date(caseData.hearingCreated), "yyyy-MM-dd")}</span>
          <div>{formatDistanceToNow(new Date(caseData.hearingCreated), { addSuffix: true })}</div>
        </div> 
      </div>

      {/* Show hearing start and end dates if available */}
      {caseData.caseHearingStartDate && (
        <>
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-black">Start: </span> {format(new Date(caseData.caseHearingStartDate), "yyyy-MM-dd")}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-black">End: </span> {format(new Date(caseData.caseHearingEndDate), "yyyy-MM-dd")}
          </p>
        </>
      )}

      {/* Display "Hearing Started" if the hearing has started */}
      {hearingHasStarted && (
        <div className="flex items-center justify-between mt-5">
          <h2 className="font-medium">Hearing Started</h2>
          <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
            <span>{format(new Date(caseData.caseHearingStartDate), "yyyy-MM-dd")}</span>
            <div className="text-blue-500">
              {formatDistanceToNow(new Date(caseData.caseHearingStartDate), { addSuffix: true })}
            </div>
          </div>
        </div>
      )}

      {/* Display "Hearing Ongoing" if the hearing has started and is still ongoing */}
      {hearingIsOngoing && (
        <div className="flex items-center justify-between mt-5">
          <h2 className="font-medium">Hearing Ongoing</h2>
          <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
            <span>{format(new Date(caseData.caseHearingStartDate), "yyyy-MM-dd")}</span>
            <div className="text-blue-500">
              {formatDistanceToNow(new Date(caseData.caseHearingStartDate), { addSuffix: true })}
            </div>
          </div>
        </div>
      )}

      {/* Display "Hearing Ended" if the hearing has ended */}
      {hearingHasEnded && (
        <div className="flex items-center justify-between mt-5">
          <h2 className="font-medium">Hearing Ended</h2>
          <div className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
            <span>{format(new Date(caseData.caseHearingEndDate), "yyyy-MM-dd")}</span>
            <div className="text-blue-500">
              {formatDistanceToNow(new Date(caseData.caseHearingEndDate), { addSuffix: true })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
