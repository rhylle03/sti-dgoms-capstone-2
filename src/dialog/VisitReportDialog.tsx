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
import { useState, useEffect } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

export default function VisitReportDialog({
  caseId,
    fullName,
    offenderName,
    studentGrade,
    programCourse,
    studentYear,
    typeOfIncident,
    whenIncidentOccur,
    incidentOccured,
    incidentSchool,
    incidentWitness,
    assistance,
    incidentDescription,
    newReport,
    created_at,
    sentBy,
    userSession,
    setForHearing,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [IncidentStatus, setincidentStatus] = useState("");
  const router = useRouter();

  console.log(userSession);

  useEffect(() => {
    const fetchincidentStatus = async () => {
      const { data, error } = await supabase
        .from("cases")
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

  const handleResolve = async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("incidentStatus")
      .eq("id", caseId)
      .single();

    if (error) {
      console.error("Error fetching IncidentStatus: ", error);
      return;
    }

    const currentStatus = data?.incidentStatus;
    const newStatus = currentStatus === "Ongoing" ? "Solved" : "Ongoing";

    const { data: updateData, error: updateError } = await supabase
      .from("cases")
      .update({ incidentStatus: newStatus })
      .eq("id", caseId);

    if (updateError) {
      console.error("Error updating row: ", updateError);
    } else {
      console.log("Row updated:", updateData);
      setincidentStatus(newStatus);

      setIsOpen(false); 
      window.location.reload(); 
    }
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("cases")
      .delete()
      .eq("id", caseId);

    if (error) {
      console.error("Error deleting row:", error);
    } else {
      console.log("Row deleted:", data);
      setIsOpen(false);
      window.location.reload();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
      
        <div className="px-6 py-3 bg-green-800 text-white rounded-full mr-6 flex items-center space-x-2" > 
        
           <span> View Case </span>
        </div>
         
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3">{sentBy}</div>
          </DialogTitle>
          <DialogDescription>
            <div>
            <div className="font-bold text-lg py-4 w-[30em]">{typeOfIncident}</div>
              <div>
              <p className="">
                  <span className="font-bold ">Student Course and Year : </span>
                  {studentGrade} {}{programCourse}{} {studentYear}
                </p>
                <p className="">
                  <span className="font-bold">Person involve in the incident : </span>
                  {offenderName}
                </p>
                <p className="">
                  <span className="font-bold">When incident occur : </span>
                  {whenIncidentOccur}
                </p>
                <p className="">
                  <span className="font-bold">Where incident occur : </span>
                  {incidentOccured}
                  <p className="">
                  <span className="font-bold">Incident inside the school : </span>
                  {incidentSchool}
                </p>
                <p className="">
                  <span className="font-bold">Where there any witnesses : </span>
                  {incidentWitness}
                </p>
                <p className="">
                  <span className="font-bold">Narrative Report : </span>
                  {incidentDescription}
                </p>
                </p>
                <p className="">
                  <span className="font-bold">Report created : </span>
                  {format(parseISO(created_at), "MM/dd/yyyy")}
                </p>
                <p className="">
                  <span className="font-bold">Reported by: </span>
                  {sentBy}
                </p>
              </div>
                <div></div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


export function VisitIncidentReportDialog({
  caseId,
  fullName,
  offenderName,
  studentGrade,
  programCourse,
  studentYear,
  typeOfIncident,
  whenIncidentOccur,
  incidentOccured,
  incidentSchool,
  incidentWitness,
  assistance,
  incidentDescription,
  newReport,
  created_at,
  sentBy,
  userSession,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [IncidentStatus, setincidentStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchincidentStatus = async () => {
      const { data, error } = await supabase
        .from("incidentReport")
        .select("newReport")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching IncidentStatus: ", error);
      } else {
        setincidentStatus(data?.newReport);
      }
    };

    fetchincidentStatus();
  }, [caseId]);

  const handleAccept = async () => {
    setIsOpen(false);
    
    const { data, error } = await supabase
      .from("incidentReport")
      .select("newReport")
      .eq("id", caseId)
      .single();

    if (error) {
      console.error("Error fetching IncidentStatus: ", error);
      return;
    }

    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const caseNumber= `CASE-${datePart}-${randomPart}`;

    const currentStatus = data?.newReport;
    const newStatus = currentStatus === "Pending" ? "Accepted" : "Pending";

    const addata ={
      acceptedDate: new Date(),
      caseNumber,
      newReportStatus: "Pending",
  };
  

    const { data: updateData, error: updateError } = await supabase
      .from("incidentReport")
      .update({ newReport: newStatus })
      .eq("id", caseId);

    if (updateError) {
      console.error("Error updating row: ", updateError);
    } else {
      console.log("Row updated:", updateData);
      setincidentStatus(newStatus);

      setIsOpen(false); 
      
    }

    try {
     
      const { data: incidentReport, error: fetchError } = await supabase
        .from("incidentReport")
        .select("*")
        .eq("id", caseId)
        .single(); 

      if (fetchError) {
        console.error("Error fetching incident report:", fetchError);
        return;
      }

      
      const { error: insertError } = await supabase.from("acceptedReport").insert({
        ...incidentReport,
        ...addata,
        id: undefined,
      });

      if (insertError) {
        console.error("Error inserting into cases:", insertError);
        return;
      }

      
      const { error: deleteError } = await supabase
        .from("incidentReport")
        .delete()
        .eq("id", caseId);

      if (deleteError) {
        console.error("Error deleting from incident_reports:", deleteError);
        return;
      }

      console.log(
        "Case successfully moved to cases table and deleted from incident_reports."
      );
    
    } catch (error) {
      console.error("Error during operation:", error);
    }

    window.location.reload();
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
          Check Case
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3">{sentBy}</div>
          </DialogTitle>
          <DialogDescription> 
              <div className="font-bold w-[20em] text-lg py-4">{typeOfIncident}</div>
              <div>
              <div>
              <p className="">
                  <span className="font-bold">Student Course and Year : </span>
                  {studentGrade} {}{programCourse}{} {studentYear}
                </p>
                <p className="">
                  <span className="font-bold">Person involve in the incident : </span>
                  {offenderName}
                </p>
                
                
                <p className="">
                  <span className="font-bold">Report created : </span>
                  {format(parseISO(created_at), "MM/dd/yyyy")}
                </p>
                <p className="">
                  <span className="font-bold">Reported by: </span>
                  {sentBy}
                </p>
              </div>
              {userSession === "School Administrator" ? (
                <div></div>
              ) : (
                <div className=" flex justify-between mt-4">
                  <button
                    onClick={handleAccept}
                    className="p-3 text-white rounded-md bg-green-600"
                  >
                    Accept{" "}
                  </button>
                  <button
                    onClick={handleDeny}
                    className="p-3 text-white rounded-md bg-red-600"
                  >
                    Deny
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
