import JobCard from "./JobCard";

export default function JobList({ jobs, onJobClick }) {
  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
      ))}
    </div>
  );
}
