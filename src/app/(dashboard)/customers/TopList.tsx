"use client";

import Avatar from "@components/Avatar";
import Progression from "@components/Progression";

const stats = [
  { id: 1, name: "John Doe", avatar: "/avatar/avatar1.png", deals: 104083700, isOnline: true },
  { id: 2, name: "Jane Smith", avatar: "/avatar/avatar2.png", deals: 1000830000, isOnline: false },
  { id: 3, name: "Alice Johnson", avatar: "/avatar/avatar3.png", deals: 1040837000, isOnline: true },
  { id: 4, name: "Bob Brown", avatar: "/avatar/avatar4.png", deals: 3480837000, isOnline: false },
  { id: 5, name: "Charlie White", avatar: "/avatar/avatar5.png", deals: 1040000, isOnline: true },
  { id: 6, name: "David Green", avatar: "/avatar/avatar6.png", deals: 1040000, isOnline: false },
  { id: 7, name: "Emma Blue", avatar: "/avatar/avatar7.png", deals: 18040000, isOnline: true },
  { id: 8, name: "Frank Black", avatar: "/avatar/avatar1.png", deals: 10470000, isOnline: false },
  { id: 9, name: "Grace Yellow", avatar: "/avatar/avatar4.png", deals: 100000000, isOnline: true },
  { id: 10, name: "Hank Gray", avatar: "/avatar/avatar6.png", deals: 9040000, isOnline: false },
];

const TopList = () => {
  // Trier les clients par deals (du plus grand au plus petit)
  const sortedStats = [...stats].sort((a, b) => b.deals - a.deals);

  // Trouver le plus grand deals pour le pourcentage
  const maxDeals = sortedStats[0]?.deals || 1;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2">
        {sortedStats.map((stat, index) => {
          const percentage = Math.round((stat.deals / maxDeals) * 100);

          // Couleurs pour les 3 premiers
          const rankColors = ["text-green-500", "text-orange-500", "text-yellow-500"];
          const textColor = rankColors[index] || "text-gray-500";

          return (
            <div
              key={stat.id}
              className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {/* Numéro */}
              <span className={`mr-4 font-bold ${textColor} ${index < 3 ? "text-xl" : "text-base"}`}>
                {index + 1}.
              </span>

              {/* Avatar */}
              <Avatar className="mr-3" isOnline={stat.isOnline} isStory={true} src={stat.avatar} fallback={stat.name[0]} />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{stat.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Deals: {stat.deals.toLocaleString()} Ar
                  </span>
                </div>

                {/* Barre de progression */}
                <Progression value={percentage} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopList;
