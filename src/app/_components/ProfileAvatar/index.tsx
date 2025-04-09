"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck, FaImage, FaPen, FaUser, FaCamera } from "react-icons/fa6";
import { updateUser } from "@/actions/users";
import { toast } from "react-toastify";

interface ProfileProps {
  userId?: string;
}

export default function ProfileAvatar({ userId }: ProfileProps) {
  const { data: session, update: updateSession } = useSession();
  const authorization = session?.user && !userId;
  
  // États
  const [coverSrc, setCoverSrc] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [fullname, setFullname] = useState("User");
  const [contact, setContact] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Références pour suivre les changements
  const prevCoverSrc = useRef(coverSrc);
  const prevProfileSrc = useRef(profileSrc);
  const prevFullname = useRef(fullname);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Initialisation des données
  useEffect(() => {
    if (session?.user) {
      setProfileSrc(session.user.image || "");
      setFullname(session.user.name || "New User");
      setContact(session.user.email || "- - -");
    }
  }, [session]);

  // Chargement des données utilisateur
  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((res) => {
          if (res) {
            setCoverSrc(res?.coverPicture || "");
            setProfileSrc(res?.image || "");
            setFullname(res?.name || "User");
            setContact(res?.email || "");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Erreur lors de la récupération des données utilisateur.");
        });
    }
  }, [userId]);

  // Mise à jour des données utilisateur
  useEffect(() => {
    const updateUserData = async () => {
      try {
        await updateUser({
          coverPicture: coverSrc,
          image: profileSrc,
          name: fullname,
        });
        
        // Mettre à jour la session
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            image: profileSrc,
            name: fullname,
            coverPicture: coverSrc,
          },
        });

        toast.success("Utilisateur mis à jour !");
      } catch (error) {
        console.error("Erreur de mise à jour", error);
        toast.error("Erreur lors de la mise à jour de l'utilisateur.");
      }
    };

    if (authorization && (
      prevCoverSrc.current !== coverSrc ||
      prevProfileSrc.current !== profileSrc ||
      prevFullname.current !== fullname
    )) {
      updateUserData();
      // Mettre à jour les références
      prevCoverSrc.current = coverSrc;
      prevProfileSrc.current = profileSrc;
      prevFullname.current = fullname;
    }
  }, [coverSrc, profileSrc, fullname, authorization]);

  // Gestion des changements
  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
    if (prevFullname.current !== fullname) {
      toast.success("Nom mis à jour !");
    }
  };

  // Upload des images
  const handleImageUpload = async (file: File, isCover: boolean) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isCover) {
          setCoverSrc(data.url);
          setCoverError(false);
          coverInputRef.current!.value = "";
        } else {
          setProfileSrc(data.url);
          setProfileError(false);
          profileInputRef.current!.value = "";
        }
        toast.success(`Image ${isCover ? "de couverture" : "de profil"} mise à jour !`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'upload ${isCover ? "cover" : "profil"}`, error);
      toast.error(`Erreur lors de la mise à jour de l'image ${isCover ? "de couverture" : "de profil"}.`);
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
          <FaPen
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>

      <p className="flex items-center gap-1 text-sm text-gray-500">
        {contact} <MdOutlineReportGmailerrorred /> <FaCircleCheck />
      </p>
      <p className="flex gap-1 text-sm text-gray-500">Inscrit le 12/01/2023</p>
    </div>
  );
}
