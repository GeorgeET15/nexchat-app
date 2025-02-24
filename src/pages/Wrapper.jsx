import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../components/supabaseClient";

function Wrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return authenticated ? <>{children}</> : <Navigate to="/signin" />;
}

export default Wrapper;
