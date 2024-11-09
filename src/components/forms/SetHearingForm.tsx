"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Assuming you have a Popover component

export default function SetInvestigation({
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState(false);
  const [isEndPopoverOpen, setIsEndPopoverOpen] = useState(false);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setIsStartPopoverOpen(false); // Close popover after selecting date
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsEndPopoverOpen(false); // Close popover after selecting date
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

    // Your submit logic goes here...
  };

  return (
    <form>
      <div className="mb-3">{fullName}</div>

      <div>
        <div className="mb-2 text-lg">Notify person involved for hearing</div>
        <input
          placeholder="Persons involved"
          className="mb-3 p-2 w-full text-black border shadow-sm"
          type="text"
          name="offenderName"
          required
        />
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
            <Popover open={isStartPopoverOpen} onOpenChange={setIsStartPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? startDate.toLocaleDateString() : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  dateFormat="yyyy/MM/dd"
                  className="border p-2 rounded"
                  placeholderText="Start Date"
                  onClickOutside={() => setIsStartPopoverOpen(false)} // Close popover if clicked outside
                />
              </PopoverContent>
            </Popover>
            {" - "}
            <Popover open={isEndPopoverOpen} onOpenChange={setIsEndPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? endDate.toLocaleDateString() : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat="yyyy/MM/dd"
                  className="border p-2 rounded"
                  placeholderText="End Date"
                  onClickOutside={() => setIsEndPopoverOpen(false)} // Close popover if clicked outside
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
  );
}
