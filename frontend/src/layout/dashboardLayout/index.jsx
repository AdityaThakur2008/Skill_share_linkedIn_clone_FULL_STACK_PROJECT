import React from "react";
import {
  get_all_usersProfile,
  getUserProfile,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { setistokenthere } from "@/config/redux/reducer/authReducer";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import style from "./style.module.css";
import {
  ExploreRounded,
  HomeRounded,
  PeopleOutlineRounded,
  PersonAddAlt,
} from "@mui/icons-material";

export default function Dashboard({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      router.push("/login");

      return;
    }

    dispatch(setistokenthere());
  }, []);

  useEffect(() => {
    if (authState.isToken) {
      dispatch(getUserProfile());
    }
  }, [authState.isToken]);
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(get_all_usersProfile());
    }
  }, [authState.all_profile_fetched]);

  return (
    <div className={style.Container}>
      <div className={style.homeContainer}>
        {/* LEFT SIDEBAR */}
        <div className={style.homeContainer_leftBar}>
          <div
            onClick={() => router.push("/dashboard")}
            className={style.sideBarOptions}>
            <HomeRounded /> <p>Scroll</p>
          </div>

          <div
            onClick={() => router.push("/discover")}
            className={style.sideBarOptions}>
            <ExploreRounded /> <p>Discover</p>
          </div>

          <div
            onClick={() => router.push("/my_connections")}
            className={style.sideBarOptions}>
            <PersonAddAlt /> <p>Requests</p>
          </div>

          <div
            onClick={() => router.push("/my_network")}
            className={style.sideBarOptions}>
            <PeopleOutlineRounded /> <p>Network</p>
          </div>
        </div>
        {/* MOBILE BOTTOM NAV */}

        {/* FEED */}
        <div className={style.feed_container}>{children}</div>

        {/* RIGHT SIDEBAR */}
        <div className={style.right_container}>
          <h3>Top Profiles</h3>

          {authState.all_profile_fetched &&
            authState.all_users?.map((profile) => (
              <div key={profile._id}>
                <p>{profile.userId.name}</p>
              </div>
            ))}
        </div>
      </div>
      <div className={style.mobile_bottom_nav}>
        <div onClick={() => router.push("/dashboard")}>
          <HomeRounded />
          <p>Scroll</p>
        </div>

        <div onClick={() => router.push("/discover")}>
          <ExploreRounded />
          <p>Discover</p>
        </div>

        <div onClick={() => router.push("/my_connections")}>
          <PersonAddAlt />
          <p>Requests</p>
        </div>

        <div onClick={() => router.push("/my_network")}>
          <PeopleOutlineRounded />
          <p>Network</p>
        </div>
      </div>
    </div>
  );
}
