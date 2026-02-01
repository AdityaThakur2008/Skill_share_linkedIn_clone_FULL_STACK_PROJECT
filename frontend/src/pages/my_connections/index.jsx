import {
  acceptOrRejectConnection,
  getMyConnections,
  receivedConnectionRequests,
} from "@/config/redux/action/authAction";
import Dashboard from "@/layout/dashboardLayout";
import UserLayout from "@/layout/Userlayout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import { API_BASE_URL } from "@/config";

export default function My_connections() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnections());
  }, []);
  useEffect(() => {
    dispatch(receivedConnectionRequests());
  }, []);

  const handleAccept = (requesterId) => {
    dispatch(
      acceptOrRejectConnection({
        requesterId: requesterId,
        action_type: "accept",
      })
    );
  };

  const handleReject = (requesterId) => {
    dispatch(
      acceptOrRejectConnection({
        requesterId: requesterId,
        action_type: "reject",
      })
    );
  };

  return (
    <UserLayout>
      <Dashboard>
        <h4>Connection requests </h4>

        <div>
          {authState?.connectionRequest?.length === 0 ? (
            <p className={style.no_req}>No connection requests received</p>
          ) : (
            authState?.connectionRequest?.map((req) => (
              <div
                onClick={() => {
                  router.push(`/veiw_profile/${req.requester.username}`);
                }}
                key={req._id}
                className={style.connection_card}>
                <div className={style.left}>
                  <img
                    src={`${API_BASE_URL}/${
                      req.requester.ProfilePicture || "default-avatar.png"
                    }`}
                    alt="profile"
                    className={style.avatar}
                  />

                  <div className={style.info}>
                    <span className={style.name}>{req.requester?.name}</span>
                    <span className={style.username}>
                      @{req.requester?.username}
                    </span>
                  </div>
                </div>

                <div className={style.right}>
                  <button
                    className={style.accept_btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(req.requester?._id);
                    }}>
                    Accept
                  </button>
                  <button
                    className={style.reject_btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(req.requester?._id);
                    }}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Dashboard>
    </UserLayout>
  );
}
