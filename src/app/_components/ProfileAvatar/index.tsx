"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck, FaImage, FaPen, FaUser, FaCamera } from "react-icons/fa6";
import moment from "moment";
import { updateUser } from "@/actions/users";

interface ProfileProps {
  userId?: string;
}

interface UserData {
  coverPicture?: string;
  image?: string;
  name?: string;
  email?: string;
  emailVerified?: Date | null;
  createdAt?: string;
}

export default function ProfileAvatar({ userId }: ProfileProps) {
  const { data: session } = useSession();
  const resolvedUserId = useMemo(() => userId || session?.user?.id, [userId, session?.user?.id]);
  const authorization = useMemo(() => resolvedUserId === session?.user?.id, [resolvedUserId, session?.user?.id]);

  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [coverSrc, setCoverSrc] = useState("");
  const [profileSrc, setProfileSrc] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);

  const [fullname, setFullname] = useState("User");
  const [contact, setContact] = useState("- - -");
  const [emailVerified, setEmailVerified] = useState("");
  const [createdAt, setCreatedAt] = useState("- - -");
  const [isEditing, setIsEditing] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!resolvedUserId) return;

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${resolvedUserId}`);
        
        const res: UserData = await response.json();
        setUserData(res);
        setCoverSrc(res.coverPicture || "");
        setProfileSrc(res.image || "");
        setFullname(res.name || "User");
        setContact(res.email || "- - -");
        setEmailVerified(res.emailVerified ? moment(res.emailVerified).format("YYYY-MM-DD") : "");
        setCreatedAt(res.createdAt || "Non définie");
      } catch (error) {
        setFetchError("Erreur de chargement du profil");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [resolvedUserId]);

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = async () => {
    setIsEditing(false);
    if (fullname !== userData.name) {
      await updateUser({ name: fullname });
    }
  };

  const handleImageUpload = useCallback(
    async (file: File | undefined, setState: (url: string) => void, key: keyof UserData) => {
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

        if (authorization) {
          await updateUser({ [key]: data.url });
        }
      } catch (error) {
        console.error("Erreur lors de l'upload", error);
      }
    },
    [authorization]
  );

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(e.target.files?.[0], setCoverSrc, "coverPicture");

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(e.target.files?.[0], setProfileSrc, "image");

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (fetchError) return <div className="text-center p-4 text-red-500">{fetchError}</div>;

  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <div className="relative w-full max-w-lg">
        {/* Cover */}
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
            <div className="h-full w-full flex items-center justify-center bg-gray-300 rounded-t-lg">
              <FaImage className="text-4xl text-gray-500" />
            </div>
          )}
          {authorization && (
            <>
              <button
                className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                onClick={() => coverInputRef.current?.click()}
              >
                <FaCamera className="text-sm text-gray-900" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                className="hidden"
                onChange={handleCoverChange}
              />
            </>
          )}
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
              <AvatarFallback className="bg-gray-200 text-gray-600 flex items-center justify-center">
                <FaUser className="text-5xl" />
              </AvatarFallback>
            )}
          </Avatar>
          {authorization && (
            <>
              <button
                className="absolute bottom-1 right-0 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                onClick={() => profileInputRef.current?.click()}
              >
                <FaCamera className="text-sm text-gray-900" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                className="hidden"
                onChange={handleProfileChange}
              />
            </>
          )}
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
        {contact}{" "}
        {emailVerified ? (
          <FaCircleCheck className="text-green-800" />
        ) : (
          <MdOutlineReportGmailerrorred />
        )}
      </p>
      {userData.createdAt && (
        <p className="text-sm text-gray-500">
          Inscrit le {moment(createdAt).format("DD MMMM YYYY")}
        </p>
      )}
    </div>
  );
}
