import { CaretDown, CaretUp, Rows, Plus } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import useTable from "../hooks/useTable";

function SidebarItem({ dbName }: { dbName: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const { getTables } = useTable();

  const { data: tables } = useQuery({
    queryKey: ["tables", dbName],
    queryFn: () => getTables(dbName ?? ""),
    staleTime: 1000 * 60 * 5,
    enabled: !!dbName,
  });

  return (
    <li className="flex flex-col w-64 h-fit">
      <div className="flex items-center gap-1">
        <button onClick={toggleOpen} className="">
          <div className="bg-slate-300 p-1 rounded">
            {isOpen ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
          </div>
        </button>
        <Link to={"/database/" + dbName} className="flex items-center gap-1">
          <img src="/database.png" alt="plus" className="w-4 h-4" />
          {dbName}
        </Link>
      </div>
      <ul
        className={`flex flex-col gap-2 ml-4 mt-2 ${
          isOpen ? "h-full" : "h-0"
        } transition-[height] duration-300 overflow-hidden`}
      >
        <li className="flex items-center gap-1">
          <Plus size={12} />
          Nova
        </li>
        {tables &&
          tables.map((table) => {
            return (
              <li key={table} className="flex items-center gap-1">
                <Rows size={12} />
                <Link className="line-clamp-1" to={"/database/" + dbName + "/table/" + table}>{table}</Link>
              </li>
            );
          })}
      </ul>
    </li>
  );
}

export default SidebarItem;
