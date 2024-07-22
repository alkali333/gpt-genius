import { UserProfile } from "@clerk/nextjs";

const ProfilePage = async () => {
  return (
    <div>
      <UserProfile routing="hash" />
    </div>
  );
};
export default ProfilePage;
