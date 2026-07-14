import { Search } from "lucide-react";
import { CATEGORIES, LOCATIONS, BUDGET_RANGES } from "../data/jobs";

export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  location,
  onLocationChange,
  budgetIndex,
  onBudgetChange,
}) {
  return (
    <div className="filter-bar">
      <div className="search-input">
        <Search size={17} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title or skill…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="select-group">
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={location} onChange={(e) => onLocationChange(e.target.value)}>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          value={budgetIndex}
          onChange={(e) => onBudgetChange(Number(e.target.value))}
        >
          {BUDGET_RANGES.map((b, i) => (
            <option key={b.label} value={i}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
