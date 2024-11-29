import { handleNewUserRegistration } from "@/actions/users";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {
  const UserData = await currentUser();

  let username = UserData?.username;
  if (!username) {
    const firstName = UserData?.firstName || "";
    const lastName = UserData?.lastName || "";
    username = `${firstName} ${lastName}`.trim();
  }

  await handleNewUserRegistration();
  
  return (
    <div className="p-10">
      <h1>Home</h1>
      <UserButton />
      <p>clerk ID : {UserData?.id}</p>
      <p> {username}</p>
      <p>{UserData?.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
