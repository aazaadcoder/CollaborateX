import { createContext, useContext, useEffect } from "react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useAuth from "@/hooks/api/use-auth";
import { UserType, WorkspaceType } from "@/types/api.type";
import useGetWorkspaceQuery from "@/hooks/api/use-get-workspace";
import { useNavigate } from "react-router-dom";

// Define the context shape
type AuthContextType = {
  user?: UserType;
  workspace? : WorkspaceType;
  error: any;
  authIsPending: boolean;
  workspaceIsPending : boolean;
  isFetching: boolean;
  refetchAuth: () => void;
  refetchWorkspace : () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate()

  // get workspace id from params
  const workspaceId = useWorkspaceId();
  const {
    data: authData,
    error: authError,
    isPending: authIsPending,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;

  // fetch workspace data 
  const {
    data : workspaceData,
    isPending : workspaceIsPending,
    error : workspaceError,
    refetch : refetchWorkspace,
  } = useGetWorkspaceQuery(workspaceId);

  const workspace = workspaceData?.workspace;

  // check if user is member of the workspace he wants to vists



  useEffect(() => { });

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        error: authError || workspaceError,
        isFetching,
        authIsPending,
        workspaceIsPending,
        refetchAuth,
        refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
