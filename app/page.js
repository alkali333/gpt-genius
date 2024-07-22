import Link from "next/link";
import { GiBrainstorm } from "react-icons/gi";
import { getRandomQuote } from "/app/utils/quotes";

const HomePage = async () => {
  const quote = await getRandomQuote();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <div className="flex items-center justify-center">
            <GiBrainstorm className="w-20 h-20 text-primary" />
            <h1 className="mb-5 text-5xl font-bold text-primary">Attenshun</h1>
          </div>
          <p className="py-6 text-lg text-secondary">{quote}</p>
          <Link href="/welcome" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
