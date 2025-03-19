import Button from "@repo/ui/button";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-white">
        <input type="text" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <Button
          variant="primary"
          size="lg"
          label={isSignin ? "Sign In" : "Sign Up"}
        />
      </div>
    </div>
  );
}
