import { auth } from "@clerk/nextjs/server";
import { AnimatedLanding } from "@/components/landing/animated-landing";

export default async function Home() {
  const { userId } = await auth();

  return <AnimatedLanding userId={userId} />;
}
