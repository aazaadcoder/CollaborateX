import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  // 1. we will check if user is authenticated or not 
  // 2. if yes then we will allow it access the protected children routes 
  // 3. otherwise redirect to login page

  const {isPending , data : authData} = useAuth();
  const user = authData?.user;

  if(isPending) return <DashboardSkeleton/>

  if(!user) return <Navigate to="/" replace/>
  // 1. by using replace, the current route will be replaced by the navigate route 
  // 2. now we cannot access the current route after navigation

 return <Outlet />;
};

export default ProtectedRoute;
