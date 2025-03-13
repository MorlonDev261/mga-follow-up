"use client";

import { Card } from "@/components/ui/card";
import Avatar from "@components/Avatar";
import Progression from "@components/Progression";

const stats = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/avatar/avatar1.png",
    lastActivity: new Date().toISOString(),
    value: 75,
    isOnline: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/avatar/avatar2.png",
    lastActivity: new Date(Date.now() - 3600000).toISOString(),
    value: 50,
    isOnline: false,
  },
  {
    id: 3,
    name: "Alice Johnson",
    avatar: "/avatar/avatar3.png",
    lastActivity: new Date(Date.now() - 7200000).toISOString(),
    value: 90,
    isOnline: true,
  },
  {
    id: 4,
    name: "Bob Brown",
    avatar: "/avatar/avatar4.png",
    lastActivity: new Date(Date.now() - 10800000).toISOString(),
    value: 30,
    isOnline: false,
  },
  {
    id: 5,
    name: "Charlie White",
    avatar: "/avatar/avatar5.png",
    lastActivity: new Date(Date.now() - 14400000).toISOString(),
    value: 65,
    isOnline: true,
  },
  {
    id: 6,
    name: "David Green",
    avatar: "/avatar/avatar6.png",
    lastActivity: new Date(Date.now() - 18000000).toISOString(),
    value: 85,
    isOnline: false,
  },
  {
    id: 7,
    name: "Emma Blue",
    avatar: "/avatar/avatar7.png",
    lastActivity: new Date(Date.now() - 21600000).toISOString(),
    value: 40,
    isOnline: true,
  },
  {
    id: 8,
    name: "Frank Black",
    avatar: "/avatar/avatar1.png",
    lastActivity: new Date(Date.now() - 25200000).toISOString(),
    value: 95,
    isOnline: false,
  },
  {
    id: 9,
    name: "Grace Yellow",
    avatar: "/avatar/avatar4.png",
    lastActivity: new Date(Date.now() - 28800000).toISOString(),
    value: 55,
    isOnline: true,
  },
  {
    id: 10,
    name: "Hank Gray",
    avatar: "/avatar/avatar6.png",
    lastActivity: new Date(Date.now() - 32400000).toISOString(),
    value: 70,
    isOnline: false,
  },
];

const TopList = () => {
  return (
    <Card className="h-full rounded-none border-r-0 w-full md:w-80 overflow-y-auto">
      <div className="p-2 space-y-1">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Avatar
              className="mr-3"
              isOnline={stat.isOnline}
              isStory={true}
              src={stat.avatar}
              fallback={stat.name[0]}
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{stat.name}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last activity:{" "}
                  {new Date(stat.lastActivity).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  <Progression value={stat.value} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopList;
