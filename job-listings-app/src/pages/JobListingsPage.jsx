import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Header from "../components/Header";
import SearchFilterBar from "../components/SearchFilterBar";
import JobList from "../components/JobList";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import JobDetailModal from "../components/JobDetailModal";
import { JOBS, BUDGET_RANGES } from "../data/jobs";
import "../styles/job-listings.css";

export default function JobListingsPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [budgetIndex, setBudgetIndex] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isFirstAttempt) {
        setIsFirstAttempt(false);
        // Simulate API call to a broken endpoint
        const response = await fetch("https://api.shiftboard.invalid/v1/jobs");
        if (!response.ok) {
          throw new Error("Service connection failed");
        }
      } else {
        // Success path on Retry
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setJobs(JOBS);
      }
    } catch (err) {
      setError("Could not establish a connection to the jobs database server. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const sortedAndFilteredJobs = useMemo(() => {
    const range = BUDGET_RANGES[budgetIndex];
    // 1. Filter the current set of jobs
    const filtered = jobs.filter((job) => {
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

    // 2. Sort the filtered subset
    const parsePostedTime = (postedStr) => {
      const num = parseInt(postedStr);
      if (postedStr.includes("hour")) return num;
      if (postedStr.includes("day")) return num * 24;
      return Infinity;
    };

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return parsePostedTime(a.posted) - parsePostedTime(b.posted);
      }
      if (sortBy === "budget-desc") {
        return b.budget - a.budget;
      }
      if (sortBy === "budget-asc") {
        return a.budget - b.budget;
      }
      return 0;
    });
  }, [jobs, searchTerm, category, location, budgetIndex, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("All Categories");
    setLocation("All Locations");
    setBudgetIndex(0);
    setSortBy("newest");
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
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {!isLoading && !error && (
        <div className="results-bar">
          Showing <strong>{sortedAndFilteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="error-state-container">
          <div className="error-icon-wrapper">
            <X size={28} strokeWidth={2.5} />
          </div>
          <h2>Server Connection Error</h2>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchJobs}>
            Retry Connection
          </button>
        </div>
      ) : sortedAndFilteredJobs.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <JobList jobs={sortedAndFilteredJobs} onJobClick={setSelectedJob} />
      )}

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
