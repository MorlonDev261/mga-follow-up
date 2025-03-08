"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { FaPen, FaUser } from "react-icons/fa";
import { useState } from "react";

interface ProfileProps {
  auth?: boolean
}

export default function ProfileAvatar({ auth=false }: ProfileProps) {
  const [error, setError] = useState(false);
  const [fullname, setFullname] = useState("John Doe");
  const [isEditing, setIsEditing] = useState(false);
  
  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
  };

  const src = "profile.jpg";

  return (
          <div className="flex flex-col items-center space-y-2 mt-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
      {!error ? (
        <AvatarImage 
            src={src}
            alt="Profile"
            width={80}
            height={80}
            priority
            className="rounded-full object-cover"
            onError={() => setError(true)}
        />
      ) : (
        <AvatarFallback className="flex items-center justify-center bg-gray-200 text-gray-600">
          <FaUser className="text-2xl" />
        </AvatarFallback>
      )}
          </Avatar>
            </div>
            <div className="flex items-center gap-2">
              {auth && isEditing ? (
                <Input
                  value={fullname}
                  onChange={handleFullnameChange}
                  onBlur={saveFullname}
                  onKeyDown={(e) => e.key === "Enter" && saveFullname()}
                  autoFocus
                  className="w-40 text-center"
                />
              ) : (
                <h2 className="text-lg font-semibold">{fullname}</h2>
              )}
              <FaPen
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditing(true)}
              />
            </div>
            <p className="text-sm text-gray-500">morlonrnd@gmail.com <MdOutlineReportGmailerrorred /> <FaCircleCheck /> </p>
            <p className="text-sm text-gray-500">Inscrit le 12/01/2023</p>
          </div>
  );
}
