"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck, FaImage, FaPen, FaUser, FaCamera } from "react-icons/fa6";
import { updateUser } from "@/actions/users";

interface ProfileProps {
  userId?: string;
}

interface UserData {
  coverPicture?: string;
  image?: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

export default function ProfileAvatar({ userId }: ProfileProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  
  const resolvedUserId = userId || session?.user?.id;
  const authorization = resolvedUserId === session?.user?.id;

  // États pour les images
  const [coverSrc, setCoverSrc] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  
  // États éditables
  const [fullname, setFullname] = useState("User");
  const [contact, setContact] = useState("- - -");
  const [isEditing, setIsEditing] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resolvedUserId) {
      setIsLoading(true);
      fetch(`/api/users/${resolvedUserId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Échec du chargement");
          return response.json();
        })
        .then((res: UserData) => {
          setUserData(res);
          setCoverSrc(res.coverPicture || "");
          setProfileSrc(res.image || "");
          setFullname(res.name || "User");
          setContact(res.email || "- - -");
        })
        .catch((error) => {
          setFetchError("Erreur de chargement du profil");
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [resolvedUserId]);

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
  };

  const handleImageUpload = async (
    file: File | undefined, 
    setState: (url: string) => void
  ) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setState(data.url);
    } catch (error) {
      console.error("Erreur lors de l'upload", error);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files?.[0], setCoverSrc);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files?.[0], setProfileSrc);
  };

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        await updateUser({
          coverPicture: coverSrc,
          image: profileSrc,
          name: fullname,
        });
      } catch (error) {
        console.error("Erreur de mise à jour", error);
      }
    };

    if (authorization) {
      handleUpdate();
    }
  }, [coverSrc, profileSrc, fullname, authorization]);

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (fetchError) return <div className="text-center p-4 text-red-500">{fetchError}</div>;

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

          {authorization && (
            <button
              className="absolute bottom-2 right-2 flex items-center justify-center p-1 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100"
              onClick={() => coverInputRef.current?.click()}
            >
              <FaCamera className="text-sm text-gray-900" />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>

        {/* Avatar */}
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

          {authorization && (
            <button
              className="absolute bottom-1 right-0 flex items-center justify-center p-1 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100"
              onClick={() => profileInputRef.current?.click()}
            >
              <FaCamera className="text-sm text-gray-900" />
            </button>
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
          <FaPen
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>

      <p className="flex items-center gap-1 text-sm text-gray-500">
        {contact} <MdOutlineReportGmailerrorred /> <FaCircleCheck />
      </p>
      {userData.createdAt && (
        <p className="flex gap-1 text-sm text-gray-500">
          Inscrit le {new Date(userData.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
