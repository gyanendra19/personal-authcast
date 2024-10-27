import { Button } from "../components/ui/button";
import MagicLinkSignUp from "./(auth-pages)/maigic-link/page";
import MicrosoftAuth from "@/components/azure_signup";

export default async function Index() {
  return (
    <div className="flex justify-center w-full items-center min-h-screen ">
      <div className="w-[30%] px-6 py-10 flex flex-col gap-6 rounded-xl shadow-md border border-gray-200/25">
      <div>
        <h2 className="text-2xl font-bold text-white">Create an account</h2>
        <p className="text-gray-400">
          Enter your email below to create your account
        </p>
      </div>

        <div className="flex space-x-4 justify-center">
          <MicrosoftAuth/>
        </div>

        <div className="text-center text-sm text-gray-500">OR CONTINUE WITH</div>
        <MagicLinkSignUp />
      </div>
    </div>
  );
}
