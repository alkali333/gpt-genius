import { UserButton } from "@clerk/nextjs";
import { currentUser, auth } from "@clerk/nextjs/server";

const MemberProfile = async () => {
  const user = await currentUser();
  const { userId } = auth();
  console.log({ userId });
  return (
    <div className="px-4 flex items-center gap-2">
      <UserButton afterSignOutUrl="/" />
      <p>{user.firstName ? `Welcome ${user.firstName}` : "Welcome"}</p>
    </div>
  );
};
export default MemberProfile;
