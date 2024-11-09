"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import { supabase } from "@/utils/supabase/client";
import "react-datepicker/dist/react-datepicker.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SetHearingDialog({
  caseId,
  fullName,
  incidentReport,
  offenseType,
  incidentStatus,
  created_at,
  sentBy,
  caseResolution,
  caseResolutionStartDate,
  caseResolutionEndDate,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState(false);
  const [isEndPopoverOpen, setIsEndPopoverOpen] = useState(false);
  const router = useRouter();

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setIsStartPopoverOpen(false); // Close the popover after selecting the date/time
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsEndPopoverOpen(false); // Close the popover after selecting the date/time
  };

  const handleSubmit = async () => {
    if (!textareaRef.current || textareaRef.current.value === "") {
      setErrorMessage("Hearing instruction is empty");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Date is empty or invalid");
      return;
    }
    const addata = {
      caseHearingInstruction: textareaRef.current.value,
      caseHearingStartDate: startDate,
      caseHearingEndDate: endDate,
      incidentStatus: "Ongoing",
      hearingStatus: "Hearing Set",
      hearingCreated: new Date(),
    };

    const { data: hearingIncident, error: fetchError } = await supabase
      .from("hearingIncident")
      .select("*")
      .eq("id", caseId)
      .single();

    if (fetchError) {
      console.error("Error fetching hearing incident:", fetchError);
      return;
    }

    const { error: insertError } = await supabase.from("ongoingCases").insert({
      ...hearingIncident,
      ...addata,
      id: undefined,
    });

    if (insertError) {
      console.error("Error inserting into hearingIncident:", insertError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("hearingIncident")
      .delete()
      .eq("id", caseId);

    if (deleteError) {
      console.error("Error deleting from incident_reports:", deleteError);
      return;
    }
    router.push("/list/set-hearing");

    console.log(
      "Case successfully moved to cases table and deleted from incident_reports."
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full">
          <Calendar size={16} />
        </div>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <form>
          <div className="mb-2 text-lg">Notify person involved for hearing</div>
          <input
            placeholder="Persons involved"
            className="mb-3 p-2 w-[40em] text-black border shadow-sm"
            type="text"
            name="offenderName"
            required
          />
          <div>
            <div className="mb-2 text-lg">Hearing instruction</div>
            <div>
              <textarea
                className="w-full border shadow-sm p-3"
                rows={4}
                ref={textareaRef}
              ></textarea>
            </div>
            <div>
              <p className="mb-2 text-lg">Hearing and Investigation Schedule</p>
              <div className="flex items-center space-x-2">
                {/* Start Date Button and Popover */}
                <Popover open={isStartPopoverOpen} onOpenChange={setIsStartPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                      onClick={() => setIsStartPopoverOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? startDate.toLocaleString() : "Select Start Date & Time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                      className="border p-2 rounded"
                      placeholderText="Start Date & Time"
                      onClickOutside={() => setIsStartPopoverOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
                {" - "}
                {/* End Date Button and Popover */}
                <Popover open={isEndPopoverOpen} onOpenChange={setIsEndPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                      onClick={() => setIsEndPopoverOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? endDate.toLocaleString() : "Select End Date & Time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                      className="border p-2 rounded"
                      placeholderText="End Date & Time"
                      onClickOutside={() => setIsEndPopoverOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="justify-center flex flex-col mt-5">
              <p className="text-red-500 text-center">{errorMessage}</p>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-sti-blue text-white px-7 py-3 mt-3 rounded-md hover:bg-sti-yellow hover:text-black transition-all"
              >
                Set for Hearing & Investigation
              </button>

              <button
                type="button"
                className="bg-red-500 text-white px-7 py-3 mt-3 rounded-md hover:text-black transition-all"
              >
                Dismiss Hearing & Investigation
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
