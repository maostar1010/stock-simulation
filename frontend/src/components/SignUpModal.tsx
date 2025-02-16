"use client";
import { useState } from "react";
import { useAuth } from "@/components/signup/AuthContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

export function SignUpForm({ onClose }: { onClose: () => void }) {
  const [signUp, setSignUp] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const { signup } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username, password);
    await signup(username, password);
    console.log("sign up form submitted.");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(username, password);
    console.log("login form submitted.");
  };

  return (
    <div className="max-w-md z-[100] w-full absolute rounded-none md:rounded-2xl flex flex-col justify-center items-center shadow-input bg-white dark:bg-black border">
      <div className="flex justify-between items-center w-full px-8 mt-2">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 pt-4">
          {signUp ? "Sign Up" : "Login"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full flex justify-center items-center text-black hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <IconX size={20} />
        </button>
      </div>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {signUp
          ? "Sign Up to StockEd to Gain Access to the Simulation and Your Personal Portfolio!"
          : "Login to StockEd to Gain Access to the Simulation and Your Personal Portfolio!"}
      </p>

      <form
        className="my-8 w-full px-8"
        onSubmit={signUp ? handleSignUp : handleLogin}
      >
        {signUp && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" placeholder="Tyler" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" placeholder="Durden" type="text" />
            </LabelInputContainer>
          </div>
        )}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Username</Label>
          <Input
            id="email"
            placeholder="UserName3000"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <div className="bg-gradient-to-r from-transparent via-green-300 dark:via-green-700 to-transparent my-8 h-[1px] w-full" />

        <button
          className="bg-green-600 relative group/btn transition hover:bg-green-500 duration-200 block dark:bg-green-800 w-full text-white rounded-2xl h-10 font-extrabold shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--green-800)_inset,0px_-1px_0px_0px_var(--green-800)_inset]"
          type="submit"
        >
          {signUp ? "Sign up" : "Login"} &rarr;
          <BottomGradient />
        </button>

        <button
          className="bg-slate-300 relative group/btn mt-2 transition hover:bg-slate-600 duration-200 block w-full text-white rounded-2xl h-10 font-extrabold shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--green-800)_inset,0px_-1px_0px_0px_var(--green-800)_inset]"
          type="submit"
          onClick={() => setSignUp((prev) => !prev)}
        >
          {signUp
            ? "Already have an account? Login!"
            : "Don't have an account? Sign Up!"}{" "}
          &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
