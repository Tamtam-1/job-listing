export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="job-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="job-card skeleton-card" key={i}>
          <div className="skel skel-line short" />
          <div className="skel skel-line" style={{ height: "18px", marginTop: "14px" }} />
          <div className="skel skel-line" style={{ width: "60%" }} />
          <div className="skel skel-line" style={{ width: "40%", marginTop: "16px" }} />
          <div className="skel-row">
            <div className="skel skel-chip" />
            <div className="skel skel-chip" />
            <div className="skel skel-chip" />
          </div>
        </div>
      ))}
    </div>
  );
}
