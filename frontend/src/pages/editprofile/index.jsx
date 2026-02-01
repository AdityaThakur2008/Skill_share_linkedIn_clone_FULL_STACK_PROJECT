import { API_BASE_URL, apiClient } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import UserLayout from "@/layout/Userlayout";
import Dashboard from "@/layout/dashboardLayout";
import style from "./style.module.css";
import {
  updateProfilePicture,
  updateUserProfile,
} from "@/config/redux/action/authAction";

export default function EditProfile() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    skills: "",
    education: [],
    workExperience: [],
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("");
  console.log();
  useEffect(() => {
    if (authState.user) {
      setFormData({
        bio: authState.user.bio || "",
        location: authState.user.location || "",
        skills: authState.user.skills?.join(", ") || "",
        education: authState.user.education || [],
        workExperience: authState.user.workExperience || [],
      });

      setPreviewPic(
        authState.user.userId?.ProfilePicture
          ? `${API_BASE_URL}/${authState.user.userId.ProfilePicture}`
          : "/default-avatar.png",
      );
    }
  }, [authState.profileFetched]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateUserProfile({
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills.split(",").map((s) => s.trim()),
        education: formData.education,
        workExperience: formData.workExperience,
      }),
    );

    if (profilePic) {
      await dispatch(updateProfilePicture(profilePic));
    }

    router.push(`/view_profile/${authState.user?.userId?.username}`);
  };

  const handleArrayChange = (index, e, type, field) => {
    const updated = [...formData[type]];
    updated[index][field] = e.target.value;
    setFormData({ ...formData, [type]: updated });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.filter((_, i) => i !== index),
    });
  };

  return (
    <UserLayout>
      <Dashboard>
        <div className={style.container}>
          {/* ===== PROFILE PREVIEW ===== */}
          <div className={style.preview}>
            <div className={style.avatarBox}>
              <img src={previewPic} className={style.avatar} />

              <label className={style.changePic}>
                Change photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setProfilePic(file);
                    setPreviewPic(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>

            <h2>{authState.user?.userId?.name}</h2>
            <p className={style.username}>
              @{authState.user?.userId?.username}
            </p>
            <p className={style.bioPreview}>
              {formData.bio || "No bio added yet"}
            </p>
            {formData.location && (
              <p className={style.location}>📍 {formData.location}</p>
            )}
          </div>

          {/* ===== EDIT FORM ===== */}
          <form onSubmit={handleSubmit} className={style.form}>
            {/* BIO */}
            <label>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} />

            {/* LOCATION */}
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            {/* SKILLS */}
            <label>Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node, MongoDB"
            />

            {/* ===== EDUCATION ===== */}
            <div className={style.sectionTitle}>
              <h4>Education</h4>
              <button
                type="button"
                onClick={addEducation}
                className={style.addBtn}>
                + Add
              </button>
            </div>

            {formData.education.map((edu, i) => (
              <div key={i} className={style.card}>
                <input
                  placeholder="School / College"
                  value={edu.school}
                  onChange={(e) =>
                    handleArrayChange(i, e, "education", "school")
                  }
                />
                <input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleArrayChange(i, e, "education", "degree")
                  }
                />
                <input
                  placeholder="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleArrayChange(i, e, "education", "fieldOfStudy")
                  }
                />

                <div className={style.row}>
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) =>
                      handleArrayChange(i, e, "education", "startDate")
                    }
                  />
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) =>
                      handleArrayChange(i, e, "education", "endDate")
                    }
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={edu.description}
                  onChange={(e) =>
                    handleArrayChange(i, e, "education", "description")
                  }
                />

                <button
                  type="button"
                  className={style.removeBtn}
                  onClick={() => removeEducation(i)}>
                  Remove
                </button>
              </div>
            ))}

            {/* ===== EXPERIENCE ===== */}
            <div className={style.sectionTitle}>
              <h4>Experience</h4>
              <button
                type="button"
                onClick={addExperience}
                className={style.addBtn}>
                + Add
              </button>
            </div>

            {formData.workExperience.map((work, i) => (
              <div key={i} className={style.card}>
                <input
                  placeholder="Company"
                  value={work.company}
                  onChange={(e) =>
                    handleArrayChange(i, e, "workExperience", "company")
                  }
                />
                <input
                  placeholder="Position"
                  value={work.position}
                  onChange={(e) =>
                    handleArrayChange(i, e, "workExperience", "position")
                  }
                />

                <div className={style.row}>
                  <input
                    type="date"
                    value={work.startDate}
                    onChange={(e) =>
                      handleArrayChange(i, e, "workExperience", "startDate")
                    }
                  />
                  <input
                    type="date"
                    value={work.endDate}
                    onChange={(e) =>
                      handleArrayChange(i, e, "workExperience", "endDate")
                    }
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={work.description}
                  onChange={(e) =>
                    handleArrayChange(i, e, "workExperience", "description")
                  }
                />

                <button
                  type="button"
                  className={style.removeBtn}
                  onClick={() => removeExperience(i)}>
                  Remove
                </button>
              </div>
            ))}

            <button type="submit" className={style.saveBtn}>
              Save Changes
            </button>
          </form>
        </div>
      </Dashboard>
    </UserLayout>
  );
}
