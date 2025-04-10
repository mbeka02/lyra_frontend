import { Role, useAuthentication } from "~/providers/AuthProvider";
interface WithRoleProps {
  children: React.ReactNode;
  role: Role;
}
export function WithRole({ children, role }: WithRoleProps) {
  const { authState } = useAuthentication();
  if (authState?.user?.role != role) {
    return <></>;
  }
  return <>{children}</>;
}
