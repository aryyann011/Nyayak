export default function FeatureCards() {
  return (
    <div className="features">
      <div className="feature-card glass">
        <h3>SOS Emergency</h3>
        <p>Rapid emergency assistance.</p>
        <button className="btn-orange">Send SOS →</button>
      </div>

      <div className="feature-card glass">
        <h3>Track Your Case</h3>
        <p>Real-time case updates.</p>
        <button className="btn-yellow">Get Updates →</button>
      </div>

      <div className="feature-card glass">
        <h3>Find Police Station</h3>
        <p>Nearby stations and contacts.</p>
        <button className="btn-blue">Find Station →</button>
      </div>

      <div className="feature-card glass">
        <h3>Crime Heatmap</h3>
        <p>Monitor crime-prone areas.</p>
        <button className="btn-green">View Map →</button>
      </div>
    </div>
  );
}
