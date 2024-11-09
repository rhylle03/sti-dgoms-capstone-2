"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Bell, Edit, Eye } from "lucide-react";

type Student = {
  id: number;
  studentName: string;
  caseNumber: string;
  hearingNewStatus: string;
  typeOfIncident: string;
  offenderName: string;
  sentBy: string,
};

const columns = [
  {
    header: "Student Name",
    accessor: "studentNumber",
  },
  {
    header: "Case number",
    accessor: "caseNumber",
    className: "hidden md:table-cell",
  },
  {
    header: "Incident Type",
    accessor: "typeOfIncident",
    className: "hidden lg:table-cell",
  },
  {
    header: "Offender Name",
    accessor: "offenderName",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "typeOfIncident",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ITEMS_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
  const year = date.getFullYear();
  
  return `${month}-${day}-${year}`;
};


const NewIncidentList = () => {

  const [viewReport, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchStudents = async (page: number) => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // Fetch only the current page's data
      const { data, error, count } = await supabase
        .from("trackingRecordingAction")
        .select("*", { count: "exact" })
        .range(start, end);

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          studentName: student.studentName,
          caseNumber: student.caseNumber,
          programCourse: student.programCourse,
          hearingNewStatus: student.hearingNewStatus,
          typeOfIncident: student.typeOfIncident,
          offenderName: student.offenderName,
          sentBy: student.sentBy,

          
        }));

        setStudents(formattedStudents);

        // Set the total pages based on the total count of items divided by items per page
        setTotalPages(Math.ceil((count ?? 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]); // Fetch students whenever the page changes

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100 p-4"
    >
      <td className="flex items-center gap-4 p-4">
        
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.sentBy}</h3>
          
        </div>
      </td>
      <td className="hidden md:table-cell">{item.caseNumber}</td>
      <td className="hidden md:table-cell">{item.typeOfIncident}</td>
      <td className="hidden md:table-cell">{item.offenderName}</td>
      <td className="hidden md:table-cell">{item.hearingNewStatus}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
            <Link href={`/list/tracking-and-recording/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
              <Edit size={16} color="black" />
            </button>
          </Link>
            <FormModal table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
      
        <h1 className="hidden md:block text-lg font-semibold">Tracking and recording actions </h1> 
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={viewReport} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
    </div>
  );
};

export default NewIncidentList;
