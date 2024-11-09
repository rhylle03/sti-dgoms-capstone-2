"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";


export function CaseDocumentationDialog({
  caseId,
  fullName,
  incidentReport,
  offenseType,
  incidentStatus,
  newReport,
  created_at,
  sentBy,
  userSession,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [IncidentStatus, setincidentStatus] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchincidentStatus = async () => {
      const { data, error } = await supabase
        .from("ongoingCases")
        .select("incidentStatus")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching IncidentStatus: ", error);
      } else {
        setincidentStatus(data?.incidentStatus);
      }
    };

    fetchincidentStatus();
  }, [caseId]);

  const handleSubmit = async () => {
    
    
    if (!textareaRef.current || textareaRef.current.value === "") {
        setErrorMessage("Case Document empty");
        return;
      }
      setIsOpen(false);
  
      const addata ={
        caseDocumentation: textareaRef.current.value,
        hearingNewStatus: "Hearing Ended",
        caseHearingEndDate: new Date(),
      };
      
  
      const { data: ongoingCases, error: fetchError } = await supabase
          .from("ongoingCases")
          .select("*")
          .eq("id", caseId)
          .single(); 
  
        if (fetchError) {
          console.error("Error fetching hearing incident:", fetchError);
          return;
        } 
        const { error: insertError } = await supabase.from("trackingRecordingAction").insert({
          ...ongoingCases,
          ...addata,
          id: undefined,
        });
  
        if (insertError) {
          console.error("Error inserting into trackingRecordning:", insertError);
          return;
        } 
        const { error: deleteError } = await supabase
          .from("ongoingCases")
          .delete()
          .eq("id", caseId);
  
        if (deleteError) {
          console.error("Error deleting from incident_reports:", deleteError);
          return;
        }
        router.push("/list/ongoing-cases")
  
        console.log(
          "Case successfully moved to cases table and deleted from incident_reports."
        );
  };

  const handleDeny = async () => {
    setIsOpen(false);
    try {
      
      const { error: deleteError } = await supabase
        .from("incidentReport")
        .delete()
        .eq("id", caseId);

      if (deleteError) {
        console.error("Error deleting from incident_reports:", deleteError);
        return;
      }

      console.log("Case successfully deleted from incident_reports.");
    } catch (error) {
      console.error("Error during delete operation:", error);
    }

    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="px-6 py-3 bg-green-800 text-white rounded-full mr-6">
          Open Case
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
          <p className="text-center text-2xl mb-2">Document Report Case</p>
          </DialogTitle>
          <DialogDescription>
            
            <div className="rounded-sm w-[70em] p-2 pt-5 bg-blue-300 text-black ">
            
             <form
                className="w-[50em] flex flex-col"  
             >
    
              <label>Documentation of the incident</label>
              <textarea
              className="w-[68em] text-arial border shadow-sm p-3 "
              ref={textareaRef}
              rows={6}
              required
              />

             
             <label>Provide more details by attaching file: Attach File below</label>
             <input
             type="file"
             className="mb-3 p-2 text-black"
             name="fileAttachment"
             />
    
            <label>Additional supporting evidence:</label>
             <input
             type="file"
             className="mb-3 p-2 text-black"
             name="fileAttachment"    
             />
             </form>
              
              {userSession === "School Administrator" ? (
                <div></div>
              ) : (
                <div className="flex flex-col items-center mt-5">
                <p className="text-red-500 text-center">{errorMessage}</p>
                <button
                  onClick={handleSubmit}
                  className="bg-sti-blue w-[45em] text-white px-7 py-3 mt-3 rounded-md hover:bg-sti-yellow hover:text-black transition-all"
                >
                  Document Case
                </button>
               
                <button
                  
                  className="bg-red-500 w-[45em] mb-4 text-white px-7 py-3 mt-3 rounded-md  hover:text-black transition-all"
                >
                  Dismiss Hearing & Investigation
                </button>
              </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
