import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";

//If no session exists, it shows a "Log in with Google" button.
//If a session exists, it displays the navigation bar and the content (children).
export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-custom-bg bg-cover w-screen h-screen flex items-center">
        <div className=" text-white text-center w-full">
          <button
            onClick={() => signIn("google")} //you need to add a provider as parameter, for google is "google" to return to our btn
            className="bg-custom-magenta text-white hover:bg-custom-dark-magenta transition p-2 px-4 rounded-lg"
          >
            Log in with Google
          </button>
        </div>
      </div>
    );
  }

  //here we will have a div which will have the side navbar and then next to it another div where we will render the content of each of the pages, children
  return (
    <div className="bg-custom-bg bg-contain min-h-screen ">
      <div className="md:hidden w-full flex justify-center p-4 pt-6 text-gold">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          {/*hamburger menu*/}
        </button>
      </div>
      <div className="flex min-h-screen">
        <Nav show={showNav} />
        <div className="bg-gray-100 bg-opacity-95 flex-grow mt-2 mr-2 mb-2 rounded-lg p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
