export default function HeroSection() {
  return (
    <div className="hero">
      <div className="hero-left">
        <h1>
          Welcome back, <span>Rahul Verma</span>
        </h1>
        <p>
          How can we assist you today? Get legal help, track cases, 
          or ensure your safety all in one place.
        </p>

        <div className="searchbar glass">
          <input placeholder="Ask your legal question..." />
          <button>➤</button>
        </div>
      </div>

      <div className="hero-right">
        <div className="assistant-card glass">
          <h4>Hello Rahul!</h4>
          <p>
            I'm your NyayaSahayak legal assistant. 
            How can I help you today?
          </p>
        </div>

        <img
          src="https://i.imgur.com/6VBx3io.png"
          alt="assistant"
          className="assistant-img"
        />
      </div>
    </div>
  );
}
