import { Plus } from "@phosphor-icons/react";
import SidebarItem from "./SidebarItem";
import { Link } from "react-router-dom";
import useDatabase from "../hooks/useDatabase";
import { useQuery } from "@tanstack/react-query";

function Sidebar() {
  const { getDatabases } = useDatabase();

  const { data } = useQuery({
    queryKey: ["databases"],
    queryFn: getDatabases,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="bg-slate-100 w-fit h-screen py-4 pl-2 pr-6 flex flex-col gap-6">
      <Link to={"/"}>
        <h1 className="font-semibold text-2xl text-emerald-600 italic">
          Node<span className="text-orange-400">MyAdmin</span>
        </h1>
      </Link>

      <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-1">
          <Link to="/databases" className="flex items-center gap-1">
            <div className="bg-slate-300 p-1 rounded">
              <Plus size={12} weight="bold" />
            </div>
            <div className="relative">
              <img src="/database.png" alt="plus" className="w-4 h-4" />
            </div>
            Novo
          </Link>
        </li>

        {data && data.map((dbName) => <SidebarItem key={dbName} dbName={dbName} />)}
      </ul>
    </div>
  );
}

export default Sidebar;
