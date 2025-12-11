import { useEffect, useState } from "react";
import styles from "./style.module.css";
import UserLayout from "@/layout/Userlayout";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/config/redux/action/authAction";
import { clearMessage } from "@/config/redux/reducer/authReducer";
export default function AuthPage() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();
  const [islogin, setIslogin] = useState(false);
  const message = authState?.message;
  const error = authState?.error;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleRegiter = () => {
    dispatch(
      registerUser({
        name,
        username,
        email,
        password,
      })
    );
  };

  const handleLogin = () => {
    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  const setIsloginMethod = () => {
    setIslogin(!islogin);
    dispatch(clearMessage());
  };
  return (
    <>
      <UserLayout>
        <div className={styles.Container}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer_left}>
              <p className={styles.card_left_heading}>
                {islogin ? "Welcome Back" : "Sign In"}
              </p>
              {message && (
                <p
                  className={
                    authState.isError ? styles.errorMsg : styles.successMsg
                  }>
                  {message}
                </p>
              )}

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.inputcontainer}>
                {!islogin && (
                  <div className={styles.inputRow}>
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                )}

                <input
                  className={styles.inputField}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  className={styles.inputField}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  className={styles.submitBtn}
                  onClick={() => {
                    islogin ? handleLogin() : handleRegiter();
                  }}>
                  {islogin ? "Login" : "Create Account"}
                </button>

                <button
                  className={styles.toggleBtn}
                  onClick={() => setIsloginMethod()}>
                  {islogin
                    ? "Don't have an account? Create one"
                    : "Already have an account? Login"}
                </button>
              </div>
            </div>
            <div className={styles.cardContainer_right}>
              <div className={styles.abstract_background}></div>
              <div className={styles.card_container}>
                <img
                  src="/women_sticker.png"
                  alt="Woman holding tablet"
                  className={styles.card_image}
                />
                <div className={styles.lightning_icon}>⚡</div>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
}
