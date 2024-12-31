import Link from "next/link";
import Image from "next/image";
import { getRandomQuote } from "/app/utils/quotes";

const HomePage = async () => {
  const quote = await getRandomQuote();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Attenshun Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <h1 className="text-3xl font-bold text-primary mt-4 -ml-1">
              The Yoga Palace Journalling App
            </h1>
          </div>
          <p className="py-6 text-lg text-secondary">{quote}</p>
          <Link href="/welcome" className="btn btn-primary rounded-xl">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
