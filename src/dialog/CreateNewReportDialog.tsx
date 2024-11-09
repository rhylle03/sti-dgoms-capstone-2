import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";


export default function CreateNewReportDialog({
  
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [offenseType, setOffenseType] = useState("DEFAULT");
  const [subOffenseType, setSubOffenseType] = useState("DEFAULT");
  const [offenderName, setOffenderName] = useState("");
  const [offenderSearchResults, setOffenderSearchResults] = useState<string[]>([]);
  const [selectedOffender, setSelectedOffender] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [caseInput, setCaseInput] = useState(""); 

  // Fetch tracking data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOffenderName("");
      setOffenseType("DEFAULT");
    } else {
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleCaseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value; 
    setCaseInput(input); 
  };

  const handleOffenderNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setOffenderName(name);

    if (name.length > 2) {
      try {
        const { data: firstNameData, error: firstNameError } = await supabase
          .from("users")
          .select("firstName, lastName")
          .ilike("firstName", `%${name}%`);

        if (firstNameError) {
          console.error("Error fetching firstName data:", firstNameError);
          return;
        }

        const { data: lastNameData, error: lastNameError } = await supabase
          .from("users")
          .select("firstName, lastName")
          .ilike("lastName", `%${name}%`);

        if (lastNameError) {
          console.error("Error fetching lastName data:", lastNameError);
          return;
        }

        const allResults = [...(firstNameData || []), ...(lastNameData || [])];
        const uniqueResults = Array.from(new Set(allResults.map((item) => `${item.firstName} ${item.lastName}`)));

        if (!allResults || allResults.length === 0) {
          setOffenderSearchResults([]);
        } else {
          setOffenderSearchResults(uniqueResults);
        }
      } catch (error) {
        console.error("Error during search:", error);
      }
    } else {
      setOffenderSearchResults([]);
    }
  };

  const handleOffenderSelect = (offender: string) => {
    setSelectedOffender(offender);
    setOffenderName(offender);
    setOffenderSearchResults([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(false);

    if (!textareaRef.current || textareaRef.current.value === "") {
      setErrorMessage("Case description is empty");
      return;
    }

    if (offenseType === "DEFAULT") {
      setErrorMessage("Please select an offense type");
      return;
    }

    const addata = {
      offenseType,
      caseReport: textareaRef.current.value,
      caseStatus: "Solved",
      hearingEnded: new Date(),
      offenderName: selectedOffender || offenderName,
      caseInput, 
      caseSanction: subOffenseType,
    };

    console.log("Data to be inserted:", addata); 

    try {
      const { data: trackingRecordingAction, error: fetchError } = await supabase
        .from("trackingRecordingAction")
        .select("*")
       
        .single();

      if (fetchError) {
        console.error("Error fetching accepted report:", fetchError);
        return;
      }

      const { error: insertError } = await supabase.from("solveCases").insert({
        ...trackingRecordingAction,
        ...addata,
        id: undefined,
      });

      if (insertError) {
        console.error("Error inserting into solveCases:", insertError);
        return;
      }

      const { error: deleteError } = await supabase
        .from("trackingRecordingAction")
        .delete()
        

      if (deleteError) {
        console.error("Error deleting from trackingRecordingAction", deleteError);
        return;
      }

      console.log("Case successfully moved to solveCases and deleted from trackingRecording.");

      setOffenseType("DEFAULT");
      setOffenderName("");
      setSelectedOffender(null);
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }

      window.location.reload();
    } catch (error) {
      console.error("Error during operation:", error);
    }
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("trackingRecordingAction")
      .delete()
      

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
      <DialogTrigger>
        <div className="py-3 px-3 bg-gray-300 text-black rounded-full mr-6">
          <Plus size={16}></Plus>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="text-center text-2xl pb-5">Create new report</p>
          </DialogTitle>
          <DialogDescription>
            <div className="rounded-md p-2 text-black">
              <form className="w-[50em] flex flex-col" onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label>Offender (Full Name)</label>
                    <input
                      value={offenderName}
                      onChange={handleOffenderNameChange}
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                      type="text"
                      name="offenderName"
                      required
                    />
                    {offenderSearchResults.length > 0 && (
                      <ul className="bg-gray-100 text-black max-h-40 overflow-auto border ">
                        {offenderSearchResults.map((offender) => (
                          <li
                            key={offender}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                            onClick={() => handleOffenderSelect(offender)}
                          >
                            {offender}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex-1">
                    <label>Case</label>
                    <input
                      value={caseInput}  
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                      onChange={handleCaseInputChange} 
                      type="text"
                      name="case"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1 mt-2">
                  <label>Type of Offense</label>
                  <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    value={offenseType}
                    onChange={(e) => setOffenseType(e.target.value)}
                    required
                  >
                    <option value="DEFAULT" disabled>
                      Select offense type
                    </option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>

                {offenseType === "Major" && (
                  <div className="flex-1 mt-2">
                    <label>Sanction Type</label>
                    <select
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                      value={subOffenseType}
                      onChange={(e) => setSubOffenseType(e.target.value)}
                    >
                      <option value="DEFAULT" disabled>
                        Select sub-offense type
                      </option>
                      <option value="Fines">Fines</option>
                      <option value="Suspension">Suspension</option>
                    </select>
                  </div>
                )}

                <div className="mt-4">
                  <label>Case Description</label>
                  <textarea
                    ref={textareaRef}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    required
                  />
                </div>

                <div className="text-center pt-5">
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                    Submit
                  </button>
                  <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded ml-2">
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
