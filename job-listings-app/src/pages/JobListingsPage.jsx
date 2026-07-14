import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import SearchFilterBar from "../components/SearchFilterBar";
import JobList from "../components/JobList";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { JOBS, BUDGET_RANGES } from "../data/jobs";
import "../styles/job-listings.css";

export default function JobListingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [budgetIndex, setBudgetIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const filteredJobs = useMemo(() => {
    const range = BUDGET_RANGES[budgetIndex];
    return JOBS.filter((job) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = category === "All Categories" || job.category === category;
      const matchesLocation = location === "All Locations" || job.location === location;
      const matchesBudget = job.budget >= range.min && job.budget <= range.max;
      return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
    });
  }, [searchTerm, category, location, budgetIndex]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("All Categories");
    setLocation("All Locations");
    setBudgetIndex(0);
  };

  return (
    <div className="page-root">
      <Header />

      <div className="hero">
        <h1>Find work that fits your shift</h1>
        <p>Real briefs from real employers. Filter by category, location, and budget.</p>
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          location={location}
          onLocationChange={setLocation}
          budgetIndex={budgetIndex}
          onBudgetChange={setBudgetIndex}
        />
      </div>

      {!isLoading && (
        <div className="results-bar">
          Showing <strong>{filteredJobs.length}</strong> of <strong>{JOBS.length}</strong> jobs
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredJobs.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <JobList jobs={filteredJobs} />
      )}
    </div>
  );
}
