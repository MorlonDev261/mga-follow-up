"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { FaImage, FaPen, FaUser, FaCamera } from "react-icons/fa";
import { useState } from "react";

interface ProfileProps {
  auth?: boolean
}

export default function ProfileAvatar({ auth=false }: ProfileProps) {
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [fullname, setFullname] = useState("John Doe");
  const [isEditing, setIsEditing] = useState(false);
  
  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
  };

  const coverSrc = "cover.jpg";
  const profileSrc = "profile.jpg";

  return (
          <div className="flex flex-col items-center space-y-2 mt-4">
            <div className="relative w-full max-w-lg">
  {/* Cover Picture */}
  <div className="relative h-32 w-full bg-gray-300">
    {coverSrc && !coverError ? (
      <Image
        src={coverSrc}
        alt="Cover"
        fill
        className="object-cover rounded-t-lg"
        onError={() => setCoverError(true)}
      />
    ) : (
      <div className="h-full w-full flex items-center justify-center bg-gray-300">
        <FaImage className="text-4xl text-gray-500" />
      </div>
    )}
    
    {/* Icône d'édition de cover */}
    <span className="absolute bottom-2 right-2 flex items-center justify-center p-1 bg-white rounded-full shadow cursor-pointer">
      <FaCamera className="text-sm text-gray-900" />
    </span>
  </div>

  {/* Avatar (Profile Picture) */}
  <div className="relative w-24 h-24 mx-auto -mt-12 border-4 border-white rounded-full">
    <Avatar className="w-full h-full">
      {profileSrc && !profileError ? (
        <AvatarImage
          src={profileSrc}
          alt="Profile"
          onError={() => setProfileError(true)}
          className="object-cover"
        />
      ) : (
        <AvatarFallback className="flex items-center justify-center bg-gray-200 text-gray-600">
          <FaUser className="text-5xl" />
        </AvatarFallback>
      )}
    </Avatar>

    {/* Icône d'édition de profile */}
    <span className="absolute bottom-1 right-0 flex items-center justify-center p-1 bg-white rounded-full shadow cursor-pointer">
      <FaCamera className="text-sm text-gray-900" />
    </span>
  </div>
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
              {auth && (
              <FaPen
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditing(true)}
              />
              )}
            </div>
            <p className="flex items-center gap-1 text-sm text-gray-500">morlonrnd@gmail.com <MdOutlineReportGmailerrorred /> <FaCircleCheck /> </p>
            <p className="flex gap-1 text-sm text-gray-500">Inscrit le 12/01/2023</p>
          </div>
  );
}
