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
  coverPicture: string;
  image: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  createdAt: string;
}

export default function ProfileAvatar({ userId }: ProfileProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [userData, setUserData] = useState<UserData>({
    coverPicture: '',
    image: '',
    name: '',
    email: '',
    emailVerified: null,
    createdAt: '',
  });

  const resolvedUserId = useMemo(() => userId || session?.user?.id, [userId, session?.user?.id]);
  const authorization = useMemo(() => resolvedUserId === session?.user?.id, [resolvedUserId, session?.user?.id]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Valeurs mémoïsées
  const { name, email, emailVerified: verifiedDate, createdAt: created } = userData;
  const fullname = useMemo(() => name || "User", [name]);
  const contact = useMemo(() => email || "- - -", [email]);
  const emailVerified = useMemo(() => 
    verifiedDate ? moment(verifiedDate).format("YYYY-MM-DD") : "", 
    [verifiedDate]
  );
  const createdAt = useMemo(() => 
    created ? moment(created).format("DD MMMM YYYY") : "- - -", 
    [created]
  );

  useEffect(() => {
    if (!resolvedUserId) return;
    
    const abortController = new AbortController();

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${resolvedUserId}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) throw new Error("Échec du chargement");
        const data: UserData = await response.json();

        setUserData({
          coverPicture: data.coverPicture || '',
          image: data.image || '',
          name: data.name || '',
          email: data.email || '',
          emailVerified: data.emailVerified || null,
          createdAt: data.createdAt || '',
        });

      } catch (error) {
          setFetchError("Erreur de chargement du profil");
          console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    return () => abortController.abort();
  }, [resolvedUserId]);

  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({ ...prev, name: e.target.value }));
  };

  const saveFullname = async () => {
    setIsEditing(false);
    if (fullname !== userData.name) {
      await updateUser({ name: fullname });
    }
  };

  const handleImageUpload = useCallback(
    async (file: File | undefined, key: keyof UserData) => {
      if (!file || !authorization) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        
        setUserData(prev => ({ ...prev, [key]: data.url }));
        await updateUser({ [key]: data.url });

      } catch (error) {
        console.error("Erreur lors de l'upload", error);
      }
    },
    [authorization]
  );

  const AuthButton = ({ children, onClick }: { 
    children: React.ReactNode; 
    onClick: () => void 
  }) => (
    authorization && (
      <button
        className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
        onClick={onClick}
      >
        {children}
      </button>
    )
  );

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (fetchError) return <div className="text-center p-4 text-red-500">{fetchError}</div>;

  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <div className="relative w-full max-w-lg">
        {/* Cover */}
        <div className="relative h-32 w-full rounded-t-lg bg-gray-300">
          {userData.coverPicture ? (
            <Image
              src={userData.coverPicture}
              alt="Cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-t-lg"
              onError={() => setUserData(prev => ({ ...prev, coverPicture: '' }))}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-300 rounded-t-lg">
              <FaImage className="text-4xl text-gray-500" />
            </div>
          )}
          
          <AuthButton onClick={() => coverInputRef.current?.click()}>
            <FaCamera className="text-sm text-gray-900" />
          </AuthButton>
          
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files?.[0], 'coverPicture')}
          />
        </div>

        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto -mt-12 border-4 border-white rounded-full">
          <Avatar className="w-full h-full">
            {userData.image ? (
              <AvatarImage
                src={userData.image}
                alt="Profile"
                className="object-cover"
                onError={() => setUserData(prev => ({ ...prev, image: '' }))}
              />
            ) : (
              <AvatarFallback className="bg-gray-200 text-gray-600 flex items-center justify-center">
                <FaUser className="text-5xl" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <AuthButton onClick={() => profileInputRef.current?.click()}>
            <FaCamera className="text-sm text-gray-900" />
          </AuthButton>
          
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files?.[0], 'image')}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {authorization && isEditing ? (
          <Input
            value={fullname}
            onChange={handleFullnameChange}
            onBlur={saveFullname}
            onKeyDown={(e) => e.key === 'Enter' && saveFullname()}
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
      
      <p className="text-sm text-gray-500">
        Inscrit le {createdAt}
      </p>
    </div>
  );
}
