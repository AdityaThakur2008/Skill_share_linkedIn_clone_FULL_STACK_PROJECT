import React, { useEffect } from "react";
import styles from "./style.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { reset } from "@/config/redux/reducer/authReducer";
import {
  getMyConnections,
  getUserProfile,
} from "@/config/redux/action/authAction";

export default function NavBar() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authState.isToken) {
      dispatch(getUserProfile());
      dispatch(getMyConnections());
    }
  }, [authState.isToken]);
  return (
    <header className={styles.navbar}>
      <div className={styles.logoSection}>
        <div className={styles.logoBox}>S</div>
        <div className={styles.logoText}>SkillUp</div>
        <span className={styles.tagline}>Social + Professional</span>
      </div>

      {/* Hamburger Icon */}
      <div className={styles.hamburger} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <nav className={`${styles.navLinks} ${open ? styles.open : ""}`}>
        {authState.profileFetched && (
          <>
            <div>Hey , {authState.user.userId.name}</div>
            <div style={{ cursor: "pointer" }}>
              <h3>Profile</h3>
            </div>
            <div
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
                dispatch(reset());
              }}
              style={{ cursor: "pointer" }}>
              <h3>Logout</h3>
            </div>
          </>
        )}
        {!authState.profileFetched && (
          <div
            onClick={() => {
              router.push("/login");
            }}
            className={styles.btnPrimary}>
            Create Profile
          </div>
        )}
      </nav>
    </header>
  );
}
