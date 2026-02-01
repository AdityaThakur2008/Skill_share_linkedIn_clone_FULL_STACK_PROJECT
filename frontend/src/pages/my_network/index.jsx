import { getMyConnections } from "@/config/redux/action/authAction";
import Dashboard from "@/layout/dashboardLayout";
import UserLayout from "@/layout/Userlayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import { API_BASE_URL } from "@/config";

export default function MyNetwork() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnections());
  }, []);

  const loggedUserId = authState?.user?.userId?._id;

  const acceptedConnections =
    authState?.connections?.filter((c) => c.status === "accepted") || [];

  return (
    <UserLayout>
      <Dashboard>
        <div className={style.page_wrapper}>
          <h2 className={style.heading}>My Network</h2>

          {acceptedConnections.map((conn) => {
            const otherUser =
              String(conn.requester._id) === String(loggedUserId)
                ? conn.recipient
                : conn.requester;

            return (
              <div
                key={conn._id}
                className={style.connection_card}
                onClick={() =>
                  router.push(`/view_profile/${otherUser.username}`)
                }>
                <img
                  className={style.profile_pic}
                  src={`${API_BASE_URL}/${otherUser.ProfilePicture}`}
                  alt="profile"
                />

                <div className={style.details}>
                  <h3>{otherUser.name}</h3>
                  <p>@{otherUser.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Dashboard>
    </UserLayout>
  );
}
