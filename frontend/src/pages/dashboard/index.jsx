
import {
  createPost,
  deleteComment,
  deletePost,
  getAllComment,
  getAllPosts,
  increment_like,
  write_comment,
} from "@/config/redux/action/postAction";
import Dashboard from "@/layout/dashboardLayout";
import UserLayout from "@/layout/Userlayout";
import style from "./style.module.css";
import React, { useEffect, useState } from "react";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "@/config";
import {
  DeleteOutline,
  Favorite,
  FavoriteBorder,
  TextsmsOutlined,
} from "@mui/icons-material";
import { resetPostId } from "@/config/redux/reducer/postReducer";


export default function dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    if (authState.isToken) {
      dispatch(getAllPosts());
    }
  }, [authState.isToken]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [commentBody, setCommentBody] = useState("");

  const handlePost = async () => {
    const result = await dispatch(
      createPost({
        text: text,
        file: file,
      })
    );
    if (createPost.fulfilled.match(result)) {
      setText("");
      setFile(null);
    }
  };
  const handleDeletePost = (postId) => {
    dispatch(deletePost({ postId }));
  };

  const openComments = (post) => {
    dispatch(getAllComment(post));
  };
  const handlePostComment = async (postId, commentBody) => {
    setCommentBody("");
    await dispatch(write_comment({ postId: postId, body: commentBody }));
    await dispatch(getAllComment({ _id: postId }));
  };
  return (
    <div>
      <UserLayout>
        <Dashboard>
          {authState.profileFetched ? (
            <div className={style.CreatePostContainer}>
              <div className={style.cp_topRow}>
                <img
                  src={`${API_BASE_URL}/${authState.user.userId.ProfilePicture}`}
                  alt="profile pic"
                  className={style.cp_profilePic}
                />

                <textarea
                  className={style.cp_textarea}
                  placeholder="What do you want to talk about?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className={style.cp_uploadRow}>
                <label className={style.cp_fileBtn}>
                  📸 Add Media
                  <input
                    type="file"
                    accept="image/*"
                    className={style.cp_fileInput}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              </div>

              {(text.length > 0 || file) && (
                <button
                  className={style.cp_postBtn}
                  onClick={() => {
                    handlePost();
                  }}>
                  Post
                </button>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
          {postState.postFatched && authState.profileFetched ? (
            
            postState.posts.map((post) => {
              return (
                <div key={post._id} className={style.postCard}>
                  {/* TOP ROW */}
                  <div className={style.postTop_container}>
                    {" "}
                    <div className={style.postTop}>
                      <img
                        src={`${API_BASE_URL}/${
                          post.userId.ProfilePicture || "default-avatar.png"
                        }`}
                        alt="profile"
                        className={style.profilePic}
                      />

                      <div>
                        <h3 className={style.name}>{post.userId.name}</h3>
                        <p className={style.username}>
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

                  {/* BODY TEXT */}
                  {post.body && <p className={style.body}>{post.body}</p>}

                  {/* MEDIA */}
                  {post.media && (
                    <div className={style.mediaWrapper}>
                      <img
                        src={post.media}
                        alt="post media"
                        className={style.postImage}
                      />
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className={style.footer}>
                    <button onClick={() => dispatch(increment_like(post._id))}>
                      {post.likedBy?.includes(authState.user.userId._id) ? (
                        <Favorite className={style.liked} />
                      ) : (
                        <FavoriteBorder />
                      )}{" "}
                      {post.likes}
                    </button>

                    <button
                      onClick={() => {
                        openComments(post);
                      }}>
                      {" "}
                      <TextsmsOutlined />
                      Comment
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Loading...</div>
          )}

          {postState.postId && (
            <div
              className={style.CommentsContainer}
              onClick={() => dispatch(resetPostId())}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={style.commentBox}>
                {/* HEADER */}
                {postState.comments?.length === 0 ? (
                  <h4 className={style.noComments}>No Comments Yet</h4>
                ) : (
                  <div className={style.commentBoxContainer}>
                    <div className={style.showcommentConatiner}>
                      {postState.comments?.map((comment, index) => {
                        return (
                          <div>
                            <div>
                              <h6>{comment.userId.username}</h6>

                              <p>{comment.body}</p>
                            </div>
                            {comment.userId._id ==
                              authState.user.userId._id && (
                              <div
                                onClick={async () => {
                                  await dispatch(deleteComment(comment._id));
                                  await dispatch(
                                    getAllComment({ _id: postState.postId })
                                  );
                                }}>
                                <DeleteOutline />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* COMMENT INPUT */}
                <div className={style.commentInputRow}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentBody}
                    onChange={(e) => {
                      setCommentBody(e.target.value);
                    }}
                    className={style.commentInput}
                  />
                  <button
                    className={style.sendBtn}
                    onClick={() => {
                      handlePostComment(postState.postId, commentBody);
                    }}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dashboard>
      </UserLayout>
    </div>
  );
}
