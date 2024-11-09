"use client"; // Client-side rendering

import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

type Student = {
  id: number;
  studentID: string;
  studentName: string;
  email?: string;
  caseRecord: string;
  year: string;
  course: string;
  contactInfo: string;
};

const columns = [
  { header: "Student Name", accessor: "studentName" },
  { header: "Student ID", accessor: "studentID", className: "hidden md:table-cell" },
  { header: "Case Record", accessor: "caseRecord", className: "hidden md:table-cell" },
  { header: "Year", accessor: "year", className: "hidden md:table-cell" },
  { header: "Course", accessor: "course", className: "hidden lg:table-cell" },
  { header: "Contact", accessor: "contactInfo", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10; // Define items per page

const StudentRecord = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchStudents = async (page: number) => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // Fetch only the current page's data
      const { data, error, count } = await supabase
        .from("studentRecord")
        .select("*", { count: "exact" })
        .range(start, end);

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          studentID: student.studentID,
          studentName: student.studentName,
          email: student.email,
          caseRecord: student.caseRecord,
          year: student.year,
          course: student.course,
          contactInfo: student.contactInfo,
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
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.studentName}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentID}</td>
      <td className="hidden md:table-cell">{item.caseRecord}</td>
      <td className="hidden md:table-cell">{item.year}</td>
      <td className="hidden md:table-cell">{item.course}</td>
      <td className="hidden md:table-cell">{item.contactInfo}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/student-records/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && <FormModal table="student" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Student Records</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={students} />
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudentRecord;
