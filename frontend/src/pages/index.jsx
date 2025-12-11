import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import UserLayout from "@/layout/Userlayout";

export default function Home() {
  return (
    <>
      <UserLayout>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Show your skills. Get noticed. Land the right job.</h1>
            <p>
              A social + professional network for students & freshers — create a
              project-backed profile, share short posts, and connect with
              recruiters.
            </p>

            <div className={styles.heroButtons}>
              <a href="/login" className={styles.btnPrimary}>
                Create Profile — It's Free
              </a>
            </div>

            <p className={styles.trustText}>
              Trusted by <strong>12,000+</strong> students & freshers — 85% say
              projects helped them get interviews.
            </p>

            <div className={styles.steps}>
              <div className={styles.step}>
                <h3>1. Quick Profile</h3>
                <p>Setup in 60s with project links</p>
              </div>
              <div className={styles.step}>
                <h3>2. Share Work</h3>
                <p>Post project updates & micro-blogs</p>
              </div>
              <div className={styles.step}>
                <h3>3. Get Hired</h3>
                <p>Recruiters discover project-backed candidates</p>
              </div>
            </div>
          </div>

          <div className={styles.feedPreview}>
            <div className={styles.feedCard}>
              <div className={styles.feedHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>AR</div>
                  <div className={styles.userInfoContent}>
                    <h4>Aman R.</h4>
                    <p>3h ago • 2 projects</p>
                  </div>
                </div>
              </div>

              <h4 className={styles.feedTitle}>Mini feed preview</h4>

              <div className={styles.post}>
                <div className={styles.postUser}>
                  <div className={`${styles.avatar} ${styles.small}`}>SM</div>
                  <div>Sana M. shared a project</div>
                </div>

                <p>"Realtime chat app using Socket.io — built in 48 hrs"</p>

                <div className={styles.actions}>
                  <button>
                    <FavoriteBorderIcon /> <span>24</span>
                  </button>
                  <button>
                    <TextsmsOutlinedIcon /> <span>6</span>
                  </button>
                  <span className={styles.tagGreen}>Project</span>
                </div>
              </div>

              <div className={styles.post}>
                <div className={styles.postUser}>
                  <div className={`${styles.avatar} ${styles.small}`}>RK</div>
                  <div>Riya K. posted an update</div>
                </div>

                <p>"Completed interview prep course — feeling confident!"</p>

                <div className={styles.actions}>
                  <button>
                    <FavoriteBorderIcon />
                    <span>9</span>
                  </button>
                  <button>
                    <TextsmsOutlinedIcon /> <span>2</span>
                  </button>
                  <span className={styles.tagOrange}>Update</span>
                </div>
              </div>

              <a href="#feed" className={styles.btnSecondarySmall}>
                View full feed
              </a>
            </div>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.feature}>
            <h3>Project Portfolios</h3>
            <p>
              Showcase live links, demos, and code — recruiters see real work.
            </p>
          </div>

          <div className={styles.feature}>
            <h3>Micro Posts & Feed</h3>
            <p>Share short updates, wins and ask for feedback.</p>
          </div>

          <div className={styles.feature}>
            <h3>Student-friendly Jobs</h3>
            <p>Jobs filtered for freshers and internship roles.</p>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>Ready to show your skills?</h2>
            <p>Create a profile and start sharing your projects today.</p>
          </div>

          <div>
            <a href="/login" className={styles.btnPrimary}>
              Create Profile
            </a>
            <a href="#" className={styles.btnSecondary}>
              Explore Feed
            </a>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>© 2025 SkillUp • Built for students & freshers</p>
          <div className={styles.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </footer>
      </UserLayout>
    </>
  );
}
