import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { endpoint } from "@/constants/endpoint";
import useAPI from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { Clock, UserCheck, Users, UserX } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { getUsers } = useAPI();

  const getUsersData = async () => {
    const url = endpoint.getAllUsers;
    const res = await getUsers(url);
    return res.data;
  };

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersData,
  });

  const stats = useMemo(() => {
    const total = users?.length || 0;
    const active =
      users?.filter((user: any) => user?.status === "Active")?.length || 0;
    const inactive =
      users?.filter((user: any) => user?.status === "Inactive")?.length || 0;
    const pending =
      users?.filter((user: any) => user?.status === "Pending")?.length || 0;

    return { total, active, inactive, pending };
  }, [users]);

  const roleData = useMemo(() => {
    if (!users) return [];

    const roleMap: Record<string, number> = {};

    users.forEach((user: any) => {
      const role = user.role || "Unknown";
      roleMap[role] = (roleMap[role] || 0) + 1;
    });

    return Object.entries(roleMap).map(([role, count]) => ({
      role,
      count,
    }));
  }, [users]);

  const statusData = useMemo(() => {
    if (!users) return [];

    const statusMap: Record<string, number> = {};

    users.forEach((user: any) => {
      const status = user.status || "Unknown";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    return Object.entries(statusMap).map(([status, value]) => ({
      status,
      value,
    }));
  }, [users]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the User Management Dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">Currently inactive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={roleData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#B3CDAD"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
