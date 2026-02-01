import { API_BASE_URL, apiClient } from "@/config";
import { get_all_usersProfile } from "@/config/redux/action/authAction";
import Dashboard from "@/layout/dashboardLayout";
import UserLayout from "@/layout/Userlayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import { useRouter } from "next/router";

export default function Discover() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(get_all_usersProfile());
    }
  }, [authState.all_profile_fetched]);

  return (
    <UserLayout>
      <Dashboard>
        {authState.all_profile_fetched && (
          <div className={style.DiscoverContainer}>
            {authState.all_users.map((profile) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${profile.userId.username}`);
                  }}
                  className={style.Profile_container}
                  key={profile._id}>
                  <div className={style.imgDiv}>
                    <img
                      className={style.img}
                      src={`${API_BASE_URL}/${
                        profile.userId.ProfilePicture || "default-avatar.png"
                      }`}
                      alt="Profile-PIC"
                    />
                  </div>
                  <p className={style.username}>{profile.userId.username}</p>

                  <p className={style.bio}>{profile.bio}</p>
                </div>
              );
            })}
          </div>
        )}
      </Dashboard>
    </UserLayout>
  );
}
