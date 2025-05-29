import { endpoint } from "@/constants/endpoint";
import useAPI from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

const Users = () => {
  const { getUsers } = useAPI();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const perPage = 8;

  const getUsersData = async () => {
    const url = endpoint.getAllUsers;
    const res = await getUsers(url);
    return res.data;
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersData,
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    const filterLower = filter.toLowerCase();

    return users.filter((user: any) => {
      return (
        user.name.toLowerCase().includes(filterLower) ||
        user.email.toLowerCase().includes(filterLower)
      );
    });
  }, [users, filter]);

  const totalPages = filteredUsers.length
    ? Math.ceil(filteredUsers.length / perPage)
    : 1;

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
        Loading users...
      </p>
    );
  }
  if (isError) {
    return (
      <p className="text-red-500 text-center py-4">
        Error: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Filter Section */}
      <div className="flex justify-end mb-4">
        <div className="relative w-64 sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Filter by name or email"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="min-w-[640px]">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6 font-semibold">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 sm:px-6 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 sm:px-6 font-semibold">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 sm:px-6 font-semibold">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-6 font-semibold text-right"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 sm:px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {user.name}
                    </th>
                    <td className="px-4 py-3 sm:px-6 truncate max-w-[150px] sm:max-w-[200px]">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "Admin"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {user.role || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {user.status || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 text-right">
                      <a
                        href={`/users/${user.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition duration-150"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 sm:px-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(currentPage - 1) * perPage + 1} to{" "}
          {Math.min(currentPage * perPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
            aria-label="Previous page"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
            aria-label="Next page"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
