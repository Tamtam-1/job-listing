import { useEffect, useRef, useState } from "react";
import { X, Star, Calendar, Clock, Briefcase, Link as LinkIcon, CheckCircle } from "lucide-react";

export default function JobDetailModal({ job, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Form fields
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Trap focus inside modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus the close button on mount
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Handle overlay click to close
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Cover letter validation (Required, min 100 characters)
    if (!coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required.";
    } else if (coverLetter.trim().length < 100) {
      newErrors.coverLetter = `Cover letter must be at least 100 characters (currently ${coverLetter.trim().length}/100).`;
    }

    // Proposed budget validation (Required, positive number)
    if (!proposedBudget.trim()) {
      newErrors.proposedBudget = "Proposed budget is required.";
    } else {
      const budgetNum = Number(proposedBudget);
      if (isNaN(budgetNum) || budgetNum <= 0) {
        newErrors.proposedBudget = "Please enter a valid positive number.";
      }
    }

    // Timeline validation (Required, positive integer)
    if (!timeline.trim()) {
      newErrors.timeline = "Timeline is required.";
    } else {
      const timelineNum = Number(timeline);
      if (isNaN(timelineNum) || timelineNum <= 0 || !Number.isInteger(timelineNum)) {
        newErrors.timeline = "Please enter a valid positive number of days.";
      }
    }

    // Portfolio URL validation (Optional, valid URL)
    if (portfolioUrl.trim()) {
      try {
        new URL(portfolioUrl);
      } catch (_) {
        newErrors.portfolioUrl = "Please enter a valid URL (e.g. https://myportfolio.com).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <>
            {/* Job Details Header */}
            <div className="modal-header-section">
              <span className="modal-job-id">{job.id}</span>
              <h2 id="modal-title" className="modal-title-text">
                {job.title}
              </h2>
              <div className="modal-employer-row">
                <span className="modal-employer-name">{job.employer}</span>
                <span className="modal-rating-badge">
                  <Star size={13} fill="currentColor" />
                  {job.employerRating.toFixed(1)}
                </span>
                <span className="modal-employer-info">{job.employerInfo}</span>
              </div>
            </div>

            <div className="modal-grid-layout">
              {/* Job Metadata & Description */}
              <div className="modal-details-side">
                <div className="detail-card">
                  <h4>Job Details</h4>
                  <div className="detail-meta-list">
                    <div className="detail-meta-item">
                      <Clock size={16} className="detail-icon" />
                      <div>
                        <span className="detail-label">Posted</span>
                        <span className="detail-value">{job.posted}</span>
                      </div>
                    </div>
                    <div className="detail-meta-item">
                      <Briefcase size={16} className="detail-icon" />
                      <div>
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{job.category}</span>
                      </div>
                    </div>
                    <div className="detail-meta-item">
                      <Calendar size={16} className="detail-icon" />
                      <div>
                        <span className="detail-label">Apply Before</span>
                        <span className="detail-value deadline-highlight">{job.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <h4>Budget Range</h4>
                  <p className="detail-budget-label">{job.budgetLabel}</p>
                </div>

                <div className="detail-card">
                  <h4>Skills Required</h4>
                  <div className="modal-skills-list">
                    {job.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proposal Form */}
              <div className="modal-form-side">
                <h3>Submit Your Proposal</h3>
                <form onSubmit={handleSubmit} noValidate>
                  {/* Proposed Budget */}
                  <div className="form-group">
                    <label htmlFor="proposed-budget" className="field-label">
                      Proposed Budget (KES) <span className="required-star">*</span>
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">KSh</span>
                      <input
                        type="text"
                        id="proposed-budget"
                        className={`form-input ${errors.proposedBudget ? "input-error" : ""}`}
                        placeholder="e.g. 150000"
                        value={proposedBudget}
                        onChange={(e) => setProposedBudget(e.target.value)}
                        required
                      />
                    </div>
                    {errors.proposedBudget && (
                      <span className="inline-error-message" role="alert">
                        {errors.proposedBudget}
                      </span>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="form-group">
                    <label htmlFor="timeline-days" className="field-label">
                      Estimated Duration (Days) <span className="required-star">*</span>
                    </label>
                    <input
                      type="number"
                      id="timeline-days"
                      min="1"
                      className={`form-input ${errors.timeline ? "input-error" : ""}`}
                      placeholder="e.g. 14"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      required
                    />
                    {errors.timeline && (
                      <span className="inline-error-message" role="alert">
                        {errors.timeline}
                      </span>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="form-group">
                    <div className="label-row">
                      <label htmlFor="cover-letter" className="field-label">
                        Cover Letter <span className="required-star">*</span>
                      </label>
                      <span className="char-counter">
                        {coverLetter.trim().length} / 100 min chars
                      </span>
                    </div>
                    <textarea
                      id="cover-letter"
                      rows="6"
                      className={`form-input form-textarea ${errors.coverLetter ? "input-error" : ""}`}
                      placeholder="Describe why you are the best fit for this project. Talk about your relevant experience..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    />
                    {errors.coverLetter && (
                      <span className="inline-error-message" role="alert">
                        {errors.coverLetter}
                      </span>
                    )}
                  </div>

                  {/* Portfolio URL */}
                  <div className="form-group">
                    <label htmlFor="portfolio-url" className="field-label">
                      Portfolio URL <span className="optional-tag">(Optional)</span>
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">
                        <LinkIcon size={14} />
                      </span>
                      <input
                        type="url"
                        id="portfolio-url"
                        className={`form-input ${errors.portfolioUrl ? "input-error" : ""}`}
                        placeholder="https://myportfolio.com"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                      />
                    </div>
                    {errors.portfolioUrl && (
                      <span className="inline-error-message" role="alert">
                        {errors.portfolioUrl}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-submit-proposal"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Proposal..." : "Submit Proposal"}
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation Success State */
          <div className="modal-success-state">
            <div className="success-icon-wrapper">
              <CheckCircle size={56} className="success-check-icon" />
            </div>
            <h2>Proposal Submitted!</h2>
            <p className="success-description">
              Your proposal for <strong>{job.title}</strong> has been successfully sent to{" "}
              <strong>{job.employer}</strong>. They will review it and get back to you soon.
            </p>

            <div className="success-details-card">
              <h4>Submission Details</h4>
              <div className="success-row">
                <span className="success-label">Proposed Budget:</span>
                <span className="success-val">KSh {Number(proposedBudget).toLocaleString()}</span>
              </div>
              <div className="success-row">
                <span className="success-label">Delivery Timeline:</span>
                <span className="success-val">{timeline} Days</span>
              </div>
              {portfolioUrl.trim() && (
                <div className="success-row">
                  <span className="success-label">Portfolio:</span>
                  <span className="success-val">{portfolioUrl}</span>
                </div>
              )}
            </div>

            <button className="btn-apply btn-success-close" onClick={onClose}>
              Back to Job Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
