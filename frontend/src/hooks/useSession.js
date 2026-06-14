import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSessionStore from "../store/sessionStore";
import { 
  getActiveSessionApi, 
  openSessionApi, 
  closeSessionApi 
} from "../api/session.api";

export const useSession = () => {
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  // Fetch active session query
  const { isLoading, error, refetch } = useQuery({
    queryKey: ["activeSession"],
    queryFn: async () => {
      const res = await getActiveSessionApi();
      if (res.success && res.data) {
        setSession(res.data);
        return res.data;
      }
      clearSession();
      return null;
    },
    retry: false,
  });

  // Open session mutation
  const openSessionMutation = useMutation({
    mutationFn: openSessionApi,
    onSuccess: (res) => {
      if (res.success && res.data) {
        setSession(res.data);
        queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      }
    },
  });

  // Close session mutation
  const closeSessionMutation = useMutation({
    mutationFn: (id) => closeSessionApi(id),
    onSuccess: (res) => {
      if (res.success) {
        clearSession();
        queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      }
    },
  });

  return {
    session,
    isLoading,
    error,
    refetch,
    openSession: openSessionMutation.mutateAsync,
    isOpening: openSessionMutation.isPending,
    closeSession: closeSessionMutation.mutateAsync,
    isClosing: closeSessionMutation.isPending,
  };
};

export default useSession;
