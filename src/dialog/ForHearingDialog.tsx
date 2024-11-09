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
import { Calendar } from "lucide-react";



export default function ForHearingDialog({
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
    caseNumber,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [SetHearing, setsetForHearing] = useState("");
  const router = useRouter();
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US");
  console.log(userSession);

  useEffect(() => {
    const fetchsetsetForHearing = async () => {
      const { data, error } = await supabase
        .from("acceptedReport")
        .select("*")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching set for hearing: ", error);
      } else {
        setsetForHearing(data?.setForHearing);
      }
    };

    fetchsetsetForHearing();
  }, [caseId]);

  const handleHearing = async () => {
    setIsOpen(false);
   
    const addata ={
        setForHearing: "For Hearing",
        forHearing: new Date(),
    };
    try {

      const { data: acceptedReport, error: fetchError } = await supabase
        .from("acceptedReport")
        .select("*")
        .eq("id", caseId)
        .single(); 

      if (fetchError) {
        console.error("Error fetching accepted report:", fetchError);
        return;
      }

      
      const { error: insertError } = await supabase.from("hearingIncident").insert({
        ...acceptedReport,
        ...addata,
        id: undefined,
      });

      if (insertError) {
        console.error("Error inserting into hearingIncident:", insertError);
        return;
      }

      
      const { error: deleteError } = await supabase
        .from("acceptedReport")
        .delete()
        .eq("id", caseId);

      if (deleteError) {
        console.error("Error deleting from incident_reports:", deleteError);
        return;
      }

      console.log(
        "Case successfully moved to cases table and deleted from incident_reports."
      );
      router.push("/list/set-hearing");
    
    } catch (error) {
      console.error("Error during operation:", error);
    }
    

  
   
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("acceptedReport")
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
           <span> <Calendar size={16}></Calendar></span>
        </div>
         
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className=" text-lg font-normal m-2 mr-4 text-center">Please confirm the details 
                before proceeding to set hearing</div>
          </DialogTitle>
          <DialogDescription>
            <div>
            <div className="font-bold text-sm py-4 w-[30em]">Case: {typeOfIncident}</div>
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
                  <p className="break-words">{incidentOccured}</p>
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
                  {formatDate(created_at)}
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
                    onClick={handleHearing}
                    className={`p-3 text-white rounded-md  ${
                      setForHearing === "For Hearing"
                        ? "bg-red-500"
                        : "bg-green-600"
                    }`}
                    
                  >
                    {setForHearing === "For Hearing"
                      ? "Cancel Hearing"
                      : "Set for Hearing"}
                      
                      
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-3 text-white rounded-md bg-red-600"
                  >
                    Delete
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