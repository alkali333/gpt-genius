import Link from "next/link";

const HomePage = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-primary">GPTGenius</h1>
          <p className="py-6 text-lg leading-loose text-secondary">
            Your AI language companion. Powered by OpenAI, it enhances your
            conversations, content creation, and more!
          </p>
          <Link href="/chat" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
