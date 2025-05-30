import { Button } from "@/components/ui/button";
import { endpoint } from "@/constants/endpoint";
import useAPI from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserEditForm from "./UserEditForm";

const UserDetails = () => {
  const { getUserById } = useAPI();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const getUserData = async () => {
    const url = endpoint.getOneUser;
    const res = await getUserById(url, id);
    return res.data;
  };

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: getUserData,
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load user.</div>;

  return (
    <div className="">
      <Button
        onClick={() => navigate(`/users`)}
        className="mb-4 flex items-center text-black hover:bg-blue-700 dark:text-white"
      >
        <ArrowLeft className="mr-2" size={20} /> Back
      </Button>

      <div className=" dark:bg-gray-900 relative rounded-2xl shadow-lg p-6 border border-gray-200 bg-white">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 text-sm flex items-center text-black hover:bg-blue-700 dark:text-white"
        >
          {isEditing ? (
            <>
              <X className="mr-1" size={18} />
              Cancel
            </>
          ) : (
            <>
              <Pencil className="mr-1" size={18} />
              Edit
            </>
          )}
        </Button>
        {isEditing ? (
          <UserEditForm setIsEditing={setIsEditing} user={user} />
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">{user?.name}</h2>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Role:</span> {user?.role}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                    user?.status === "Active"
                      ? "bg-green-500"
                      : user?.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                >
                  {user?.status}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
