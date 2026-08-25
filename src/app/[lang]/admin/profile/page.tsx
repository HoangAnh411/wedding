import { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | Wedding Admin",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
