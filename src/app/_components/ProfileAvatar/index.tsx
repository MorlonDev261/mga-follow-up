"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaCircleCheck, FaImage, FaPen, FaUser, FaCamera } from "react-icons/fa6";
import moment from "moment";
import { updateUser } from "@/actions/users";
import type { User } from "@prisma/client";

interface ProfileProps {
  userId?: string;
}

interface UpdateUserPayload {
  userId: string;
  name?: string;
  image?: string;
  coverPicture?: string;
}

export default function ProfileAvatar({ userId }: ProfileProps) {
  const { data: session } = useSession();
  const resolvedUserId = userId || session?.user?.id;
  const authorization = resolvedUserId === session?.user?.id;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<User>({
    queryKey: ['user', resolvedUserId],
    queryFn: () =>
      fetch(`/api/users/${resolvedUserId}`).then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      }),
    enabled: !!resolvedUserId,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', resolvedUserId] });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const createdAt = useMemo(() => {
    return data?.createdAt ? moment(data.createdAt).format("DD MMMM YYYY") : "- - -";
  }, [data?.createdAt]);

  const emailVerified = useMemo(() => {
    return data?.emailVerified ? moment(data.emailVerified).format("YYYY-MM-DD") : "";
  }, [data?.emailVerified]);

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const saveFullname = () => {
    setIsEditing(false);
    if (fullname.trim() && fullname.trim() !== data?.name) {
      mutation.mutate({ userId: resolvedUserId!, name: fullname.trim() });
    }
  };

  const handleImageUpload = async (
    file: File | undefined,
    field: "coverPicture" | "image"
  ) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.url) {
        mutation.mutate({ userId: resolvedUserId!, [field]: result.url });
      }
    } catch (error) {
      console.error("Erreur lors de l'upload", error);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files?.[0], "coverPicture");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files?.[0], "image");
  };

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Erreur de chargement</div>;

  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <div className="relative w-full max-w-lg">
        {/* Cover Picture */}
        <div className="relative h-32 w-full rounded-t-lg bg-gray-300">
          {data?.coverPicture && !coverError ? (
            <Image
              src={data.coverPicture}
              alt="Cover"
              fill
              priority
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
            {data?.image && !profileError ? (
              <AvatarImage
                src={data.image}
                alt="Profile"
                onError={() => setProfileError(true)}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="flex items-center justify-center bg-gray-200 text-gray-600">
                {data?.name?.charAt(0).toUpperCase() || <FaUser className="text-5xl" />}
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
          <h2 className="text-lg font-semibold">{data?.name || "Utilisateur"}</h2>
        )}
        {authorization && (
          <FaPen
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => {
              setFullname(data?.name || "");
              setIsEditing(true);
            }}
          />
        )}
      </div>

      <p className="flex items-center gap-1 text-sm text-gray-500">
        {data?.email || "- - -"}
        {emailVerified ? (
          <FaCircleCheck className="text-green-800" />
        ) : (
          <MdOutlineReportGmailerrorred />
        )}
      </p>

      {createdAt && (
        <p className="flex gap-1 text-sm text-gray-500">Inscrit le {createdAt}</p>
      )}
    </div>
  );
}
