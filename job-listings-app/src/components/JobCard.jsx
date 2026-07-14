import { MapPin, Clock, Users } from "lucide-react";

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="ticket-row">
        <span className="job-code">{job.id}</span>
        <span className="category-chip">{job.category}</span>
      </div>

      <div className="ticket-divider" />

      <h3 className="job-title">{job.title}</h3>
      <p className="job-employer">{job.employer}</p>

      <div className="job-meta">
        <span className="meta-item">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="meta-item">
          <Clock size={14} /> {job.posted}
        </span>
      </div>

      <div className="skills-row">
        {job.skills.map((s) => (
          <span key={s} className="skill-tag">
            {s}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <div>
          <span className="budget">{job.budgetLabel}</span>
          <span className="proposals">
            <Users size={13} /> {job.proposals} proposals
          </span>
        </div>
        <button className="btn-apply">Apply</button>
      </div>
    </article>
  );
}
