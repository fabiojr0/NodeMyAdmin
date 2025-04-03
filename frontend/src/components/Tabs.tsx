import { Link } from "react-router-dom";

function Tabs({ tabs }: { tabs: { tab: string; name: string }[] }) {
  const activeTab = window.location.pathname || "home";

  return (
    <ul className="flex items-center">
      {tabs.map((tab) => {
        return (
          <li key={tab.name} className={`${activeTab === tab.tab ? "bg-white" : "bg-zinc-200"} shadow`}>
            <Link to={`/${tab.tab.toLowerCase()}`} className="p-2 text-zinc-950">
              {tab.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default Tabs;
