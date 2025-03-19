"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck, FaImage, FaPen, FaUser, FaCamera } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

interface ProfileProps {
  userId?: string;
}

export default function ProfileAvatar({ userId }: ProfileProps) {
  const { data: session } = useSession();
  const authorization = session?.user && !userId;
  const [coverSrc, setCoverSrc] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [fullname, setFullname] = useState("User");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileSrc(session.user.image || "");
      setFullname(session.user.name || "User");
    }
  }, [session]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((res) => {
          if (res) {
            setCoverSrc(res?.pdc || "");
            setProfileSrc(res?.pdp || "");
            setFullname(res?.name || "User");
          }
        })
        .catch((error) => console.error(error));
    }
  }, [userId]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverSrc(URL.createObjectURL(file));
      setCoverError(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileSrc(URL.createObjectURL(file));
      setProfileError(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <div className="relative w-full max-w-lg">
        {/* Cover Picture */}
        <div className="relative h-32 w-full rounded-t-lg bg-gray-300">
          {coverSrc && !coverError ? (
            <Image
              src={coverSrc}
              alt="Cover"
              fill
              className="object-cover rounded-t-lg"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center rounded-t-lg bg-gray-300">
              <FaImage className="text-4xl text-gray-500" />
            </div>
          )}

          {/* Icône d'édition de cover */}
          {authorization && (
            <span
              className="absolute bottom-2 right-2 flex items-center justify-center p-1 bg-white rounded-full shadow cursor-pointer"
              onClick={() => coverInputRef.current?.click()}
            >
              <FaCamera className="text-sm text-gray-900" />
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            className="hidden"
            onChange={handleCoverChange}
          />
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
          {authorization && (
            <span
              className="absolute bottom-1 right-0 flex items-center justify-center p-1 bg-white rounded-full shadow cursor-pointer"
              onClick={() => profileInputRef.current?.click()}
            >
              <FaCamera className="text-sm text-gray-900" />
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            className="hidden"
            onChange={handleProfileChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {authorization && isEditing ? (
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
        {authorization && (
          <FaPen className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
}
