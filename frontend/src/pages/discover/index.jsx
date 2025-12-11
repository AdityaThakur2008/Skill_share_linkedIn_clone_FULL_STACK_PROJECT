import { get_all_usersProfile } from "@/config/redux/action/authAction";
import Dashboard from "@/layout/dashboardLayout";
import UserLayout from "@/layout/Userlayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div>
      <UserLayout>
        <Dashboard>
          <div>Discover</div>
        </Dashboard>
      </UserLayout>
    </div>
  );
}
