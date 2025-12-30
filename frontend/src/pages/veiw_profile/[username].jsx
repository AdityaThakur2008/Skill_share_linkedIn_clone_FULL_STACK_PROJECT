import { API_BASE_URL, apiClient } from "@/config";

import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import UserLayout from "@/layout/Userlayout";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsTokenNotThere,
  setistokenthere,
} from "@/config/redux/reducer/authReducer";
import Dashboard from "@/layout/dashboardLayout";
import { deletePost, getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import {
  DeleteOutline,
  Favorite,
  FavoriteBorder,
  TextsmsOutlined,
} from "@mui/icons-material";
import { sendConnectionRequest } from "@/config/redux/action/authAction";

export default function veiw_profile({ profile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [isCurrentUserConnected, setCurrentUserConnected] = useState(false);
  const [userPost, setUserPost] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      dispatch(setIsTokenNotThere());

      return;
    }

    dispatch(setistokenthere());
  }, [authState.isToken]);

  const getUserPost = async () => {
    await dispatch(getAllPosts());
    // await dispatch(
    //   getConnectionRequest({ token: localStorage.getItem("token") })
    // );
  };

  useEffect(() => {
    let userPosts = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPost(userPosts);
  }, [postState.posts]);

  useEffect(() => {
    console.log(authState.connections, profile.userId._id);

    if (
      authState.connections.some(
        (user) => user.connectionid._id === profile.userId._id
      )
    ) {
      setCurrentUserConnected(true);
    }
  }, [authState.connections]);

  useEffect(() => {
    getUserPost();
  }, []);

  const handleDeletePost = (postId) => {
    dispatch(deletePost({ postId }));
  };
  return (
    <UserLayout>
      <Dashboard>
        <div className={style.container}>
          <div className={style.section}>
            {/* Cover Section - Uses dynamic inline style for background image */}
            <div className={style.cover}>
              {/* Avatar Section - Uses standard <img> tag */}
              <img
                src={`${API_BASE_URL}/${
                  profile.userId.ProfilePicture || "default-avatar.png"
                }`}
                alt={`${profile.userId.name}'s avatar`}
                className={style.avatar}
              />
            </div>

            {/* Profile Details Section */}
            <div className={style.details}>
              <h1>{profile.userId.name}</h1>
              <p className={style.username}>@{profile.userId.username}</p>
              <p className={style.bio}>{profile.bio}</p>
              {profile.location && (
                <p className={style.location}>📍 {profile.location}</p>
              )}

              {isCurrentUserConnected ? (
                <button className={style.connectedbtn}>Connected</button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(sendConnectionRequest(profile.userId._id));
                  }}
                  className={style.button_18}>
                  Connect
                </button>
              )}
            </div>
          </div>

          {/* Recent activity section start */}
          <div className={style.activity_container}>
            <div className={style.activity_header}>
              <h4 style={{ margin: 0 }}>Activity</h4>

              {isCurrentUserConnected ? (
                <button
                  className={style.connectedbtn}
                  style={{ minHeight: "30px", fontSize: "14px" }}>
                  Connected
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(sendConnectionRequest(profile.userId._id));
                  }}
                  className={style.button_18}
                  style={{ minHeight: "30px", fontSize: "14px" }}>
                  Connect
                </button>
              )}
            </div>

            <div className={style.activity_scroll_row}>
              {postState.postFatched && authState.profileFetched ? (
                userPost.slice(0, 5).map((post) => (
                  <div key={post._id} className={style.activity_card}>
                    <div className={style.activity_post_top}>
                      <div className={style.postTop_container}>
                        <img
                          src={`${API_BASE_URL}/${
                            post.userId.ProfilePicture || "default-avatar.png"
                          }`}
                          className={style.activity_mini_avatar}
                          alt="profile"
                        />
                        <div>
                          <h5 style={{ margin: 0, fontSize: "14px" }}>
                            {post.userId.name}
                          </h5>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              color: "#666",
                            }}>
                            @{post.userId.username}
                          </p>
                        </div>
                      </div>
                      {post.userId._id === authState.user.userId._id && (
                        <div
                          onClick={() => {
                            handleDeletePost(post._id);
                          }}
                          className={style.deletebtn}>
                          <DeleteOutline />
                        </div>
                      )}
                    </div>

                    {post.body && (
                      <p className={style.activity_post_body}>{post.body}</p>
                    )}

                    {post.media ? (
                      <div className={style.activity_media_box}>
                        <img
                          src={post.media}
                          alt="post"
                          className={style.activity_post_img}
                        />
                      </div>
                    ) : (
                      <div className={style.activity_media_box}>
                        <p style={{ textAlign: "center" }}>no media</p>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginTop: "10px",
                        paddingLeft: "5px",
                      }}>
                      <FavoriteBorder
                        style={{ fontSize: "20px", color: "#666" }}
                      />
                      <TextsmsOutlined
                        style={{ fontSize: "20px", color: "#666" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
          {/* Recent activity section end */}
        </div>
      </Dashboard>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const response = await apiClient.get("/user/getUserProfileFromUsername", {
    params: {
      username: context.query.username,
    },
  });

  const profile = await response.data.userProfile;
  console.log(profile);

  return { props: { profile } };
}
