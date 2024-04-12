import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  // if no session is found, it renders the layout
  if (!session) return <Layout />;

  return (
    <Layout>
      <div className="text-custom-magenta flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-custom-pink gap-1 text-gray-500 rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt="profile picture"
            className="w-6 h-6"
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
