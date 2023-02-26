import { Outlet} from "react-router-dom";
import { AuthProvider} from "../Auth/AuthProvider";

export const AuthGuard = () => {

  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
