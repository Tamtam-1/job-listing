import { SlidersHorizontal } from "lucide-react";

export default function EmptyState({ onReset }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <SlidersHorizontal size={28} />
      </div>
      <h3>No jobs match these filters</h3>
      <p>Try widening your search, or clear filters to see everything on the board.</p>
      <button className="btn-signin" onClick={onReset}>
        Clear filters
      </button>
    </div>
  );
}
