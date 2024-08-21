import React, { useEffect, useState } from "react";

import { makeSecuredRequest } from "../utils/makeSecuredRequest";
import { User } from "@/types/user";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const data = await makeSecuredRequest("/api/auth/");
      setUser(data);
    })();
  }, []);
  return {
    user,
  };
};

export default useUser;
