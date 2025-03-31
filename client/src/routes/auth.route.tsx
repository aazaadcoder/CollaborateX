import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  // this is a wrapper for all the auth routes so this parent component will render for all the auth routes and its children route will render in the Outlet component below
  // 2. this is to check if user is authenticated or not 
  
  const location = useLocation(); 

  // get current user data
  const {data : authData, isPending} = useAuth();
  const user = authData?.user;

  // check if the route/url if auth route then we will not show dashboard skelton

  const _isAuthRoute = isAuthRoute(location.pathname);

  // show dashboard skelton when fetching auth data
  if(isPending && !_isAuthRoute) return <DashboardSkeleton/>
  
  // if user not logged in then show the signin/signup/googleauth route 
  if (!user) return <Outlet />;

  return <Navigate to={`workspace/${user.currentWorkspace?._id}`}/>
};

export default AuthRoute;
