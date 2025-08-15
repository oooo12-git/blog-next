"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  task: string;
  deadline: string;
  method: string;
  link: string;
}

interface ChecklistTableProps {
  items: ChecklistItem[];
  cookieName: string;
}

export default function ChecklistTable({
  items,
  cookieName,
}: ChecklistTableProps) {
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const savedState = Cookies.get(cookieName);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (typeof parsedState === "object" && parsedState !== null) {
          setCheckedState(parsedState);
        }
      } catch (error) {
        console.error("Failed to parse checklist cookie:", error);
      }
    }
  }, [cookieName]);

  const handleCheckboxChange = (id: string) => {
    const newState = { ...checkedState, [id]: !checkedState[id] };
    setCheckedState(newState);
    Cookies.set(cookieName, JSON.stringify(newState), { expires: 365 });
  };

  return (
    <div className="not-prose">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">완료</TableHead>
            <TableHead>할 일</TableHead>
            <TableHead>기한</TableHead>
            <TableHead>방법</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">
                <Checkbox
                  aria-label={`Checkbox for ${item.task}`}
                  checked={checkedState[item.id] || false}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{item.task}</TableCell>
              <TableCell>{item.deadline}</TableCell>
              <TableCell>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {item.method}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
