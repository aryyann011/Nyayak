export default function CasesAndMap() {
  return (
    <div className="cases-map">
      <div className="cases glass">
        <h2>My Cases</h2>

        <div className="case-card">
          <h4>0123456</h4>
          <p>Status: Investigation</p>
          <p>Next Hearing: July 15, 2026</p>
        </div>
      </div>

      <div className="map glass">
        <h2>Safety Map: Crime Heatmap</h2>
        <div className="map-box">
          Heatmap Preview
        </div>
      </div>
    </div>
  );
}
