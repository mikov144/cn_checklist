// src/pages/Home.tsx

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-synth-background bg-cover bg-center flex flex-col p-2" style={{ backgroundImage: "url('/images/_main-background.webp')"}}>
      <Header />
      <div className="flex-grow flex flex-col items-center p-6">
        <section className="max-w-4xl w-full bg-gray-900/90 rounded-lg p-8 backdrop-blur-sm shadow-lg border border-gray-800">
          <div className="flex flex-col items-center mb-8">
            <img src="/images/_about-boop.gif" alt="milk boops" className="w-auto h-37 mb-4" />
            <h1 className="font-retro neon-text text-synth-primary mb-6 text-center text-4xl sm:text-5xl">
              Welcome to the milk's corner! My name is milk!
            </h1>
            <img src="/images/_about-milkstand.png" alt="milk stands" className="max-w-full sm:w-auto sm:h-37 mb-4" />
          </div>

          <div className="space-y-4 text-synth-secondary neon-text text-2xl">
            <p>
              I like anime and videogames and my favorite band is Nickelback!
            </p>
            <p>
              Be sure to <Link to="/login" className="text-synth-primary link-hover inline-block highlight-text cursor-pointer">register or log in</Link> to use all of the website's features! Current avaiable functionality:
            </p>
            <ul>
              <li>
                <Link to="/checklist" className="text-synth-primary link-hover inline-block highlight-text cursor-pointer">
                  Checklist
                </Link>
              </li>
            </ul>
            <h2 className="text-3xl font-retro text-synth-primary mt-8 mb-4">
              Contact me:
            </h2>

            <div className="space-y-3">
              <p>
                You can find my YouTube channel here:{' '}
                <a 
                  href="https://www.youtube.com/channel/UCY2uiqwdT4ET_6hCgg_VgQw" 
                  className="text-synth-primary link-hover inline-block highlight-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  link to my channel
                </a>
              </p>
              <p>
                XMPP:{' '}
                <span className="text-synth-primary highlight-text">milk@macaw.me</span>
              </p>
              <p>
                Telegram:{' '}
                <span className="text-synth-primary highlight-text">@mikov144</span>
              </p>
              <p>
                Discord:{' '}
                <span className="text-synth-primary highlight-text">mikov144</span>
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;