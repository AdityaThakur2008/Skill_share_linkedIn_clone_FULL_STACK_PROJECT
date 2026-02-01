import { API_BASE_URL, apiClient } from "@/config";

import React, { useEffect, useMemo, useState } from "react";
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
  Download,
  Favorite,
  FavoriteBorder,
  ModeEdit,
  PersonPinCircle,
  TextsmsOutlined,
} from "@mui/icons-material";
import {
  getMyConnections,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function veiw_profile({ profile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const isOwnProfile = authState?.user?.userId?._id === profile?.userId._id;

  const [userPost, setUserPost] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (
      !authState?.connections?.length ||
      !authState?.user?.userId?._id ||
      !profile?.userId?._id
    ) {
      return;
    }
    if (
      !Array.isArray(authState?.connections) ||
      !authState?.user?.userId?._id ||
      !profile?.userId?._id
    ) {
      return;
    }

    const connection = authState.connections.find(
      (c) =>
        (c?.requester?._id === authState.user.userId._id &&
          c?.recipient?._id === profile.userId._id) ||
        (c?.recipient?._id === authState.user.userId._id &&
          c?.requester?._id === profile.userId._id),
    );

    setIsPending(connection?.status === "pending");
    setIsConnected(connection?.status === "accepted");
  }, [
    authState.connections,
    authState?.user?.userId?._id,
    profile?.userId?._id,
  ]);

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      dispatch(setIsTokenNotThere());

      return;
    }

    dispatch(setistokenthere());
  }, [authState.isToken]);

  const getUserPost = async () => {
    await dispatch(getAllPosts());
  };

  useEffect(() => {
    let userPosts = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPost(userPosts);
  }, [postState.posts]);

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
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                }}>
                {isOwnProfile && (
                  <button
                    onClick={() => router.push("/editprofile")}
                    className={style.button_18}>
                    Edit Profile <ModeEdit />
                  </button>
                )}

                {profile?.userId?._id &&
                  !isOwnProfile &&
                  (isConnected ? (
                    <button className={style.button_18} disabled>
                      Connected
                    </button>
                  ) : isPending ? (
                    <button className={style.button_18} disabled>
                      Pending
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        if (!profile?.userId?._id) return;
                        await dispatch(
                          sendConnectionRequest(profile.userId._id),
                        );
                        await dispatch(getMyConnections());
                      }}
                      className={style.button_18}>
                      Connect
                    </button>
                  ))}
                <div
                  className={style.btn}
                  onClick={async () => {
                    const response = await apiClient.get(
                      `/user/download_resume?Id=${profile._id}`,
                    );
                    console.log(response);
                    window.open(`${API_BASE_URL}/${response?.data}`, "_blank");
                  }}>
                  <Download className={style.btnIcon} />
                  <span>Download Profile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity section start */}
          <div className={style.activity_container}>
            <div className={style.activity_header}>
              <h4 style={{ margin: 0 }}>Activity</h4>

              {profile?.userId?._id &&
                !isOwnProfile &&
                (isConnected ? (
                  <button className={style.button_18} disabled>
                    Connected
                  </button>
                ) : isPending ? (
                  <button className={style.button_18} disabled>
                    Pending
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (!profile?.userId?._id) return;
                      await dispatch(sendConnectionRequest(profile.userId._id));
                      await dispatch(getMyConnections());
                    }}
                    className={style.button_18}>
                    Connect
                  </button>
                ))}
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
          <div className={style.profile_extras}>
            {/* Skills */}
            <div className={style.extra_card}>
              <h4>Skills</h4>
              {profile.skills.length > 0 ? (
                <div className={style.skill_list}>
                  {profile.skills.map((skill, i) => (
                    <span key={i} className={style.skill_tag}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={style.empty_text}>No skills added yet</p>
              )}
            </div>

            {/* Education */}
            <div className={style.extra_card}>
              <h4>Education</h4>

              {profile.education.length > 0 ? (
                profile.education.map((edu, i) => (
                  <div key={i} className={style.edu_item}>
                    <h5>{edu.school}</h5>
                    <p>
                      {edu.degree} · {edu.fieldOfStudy}
                    </p>
                    <p className={style.edu_date}>
                      {new Date(edu.startDate).getFullYear()} –{" "}
                      {edu.endDate
                        ? new Date(edu.endDate).getFullYear()
                        : "Present"}
                    </p>
                    {edu.description && (
                      <p className={style.edu_desc}>{edu.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className={style.empty_text}>No education details</p>
              )}
            </div>

            {/* Work Experience */}
            <div className={style.extra_card}>
              <h4>Experience</h4>

              {profile.workExperience.length > 0 ? (
                profile.workExperience.map((work, i) => (
                  <div key={i} className={style.exp_item}>
                    <h5>{work.company}</h5>
                    <p>{work.position}</p>
                    <p className={style.edu_date}>
                      {new Date(work.startDate).getFullYear()} –{" "}
                      {work.endDate
                        ? new Date(work.endDate).getFullYear()
                        : "Present"}
                    </p>
                    {work.description && (
                      <p className={style.edu_desc}>{work.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className={style.empty_text}>No work experience added</p>
              )}
            </div>
          </div>
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

  return { props: { profile } };
}
