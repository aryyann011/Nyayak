export default function TopNav() {
  return (
    <div className="topnav glass">
      <div className="logo">
        ⚖ <span>Nyaya</span>Sahayak
      </div>

      <div className="navlinks">
        <a>Features</a>
        <a>My Cases</a>
        <a>Safety Map</a>
        <a>About</a>
      </div>

      <div className="profile">
        <span>Rahul Verma</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
        />
      </div>
    </div>
  );
}
