"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Bell, Edit, Plus, Trash, X } from "lucide-react"; // Adjust icon imports as needed

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SetHearingForm = dynamic(() => import("./forms/SetHearingForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  sethearing: (type, data) => <SetHearingForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id, // Ensure `id` is passed as a prop
}: {
  table: "teacher" | "sethearing" | "parent" | "subject" | "student";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number; // Add id for passing caseId
}) => {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState<"create" | "update" | "delete">(type);

  // Ensure `id` is valid before trying to render SetHearingForm
  const Form = () => {
    if (formType === "delete" && id) {
      return (
        <form action="" className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    }

    if (formType === "create" || formType === "update") {
      // Check if `table` is sethearing and `id` is provided
      if (table === "sethearing" && id) {
        return <SetHearingForm id={id} caseId={id} type={formType} data={data} />;
      }
      // Render other forms
      return forms[table](formType, data);
    }

    return "Form not found!";
  };

  return (
    <>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
        onClick={() => {
          setFormType(type); // Set form type based on initial `type` prop
          setOpen(true); // Open modal
        }}
      >
        {type === "create" ? <Plus size={16} color="black" /> : <Trash size={16} color="black" />}
      </button>

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={14} color="black" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;

