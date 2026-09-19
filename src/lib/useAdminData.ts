import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { adminOverview, adminUsers } from "@/lib/admin.functions";
import { getAdminToken } from "@/hooks/useAuth";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => setToken(getAdminToken()), []);
  return token;
}

export function useAdminOverview() {
  const token = useToken();
  return {
    token,
    ...useQuery({
      queryKey: ["admin-overview"],
      queryFn: () => adminOverview({ data: { token: token as string } }),
      enabled: !!token,
    }),
  };
}

export function useAdminUsers() {
  const token = useToken();
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminUsers({ data: { token: token as string } }),
    enabled: !!token,
  });
}
