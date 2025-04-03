import { Link, useLocation } from "react-router-dom";

function Tabs({ tabs }: { tabs: { tab: string; name: string }[] }) {
  const location = useLocation(); // Usa React Router para pegar a URL atual

  return (
    <ul className="flex items-center">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.tab; // Comparação direta correta

        return (
          <li key={tab.name} className={`${isActive ? "bg-white" : "bg-zinc-200"} shadow py-2 px-6 `}>
            <Link to={tab.tab} className="text-zinc-950">
              {tab.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default Tabs;
