"use client";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    date: "",
    location: "",
    venue: "",
    hireType: "",
    details: {},
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDetailsChange = (e) =>
    setFormData({
      ...formData,
      details: { ...formData.details, [e.target.name]: e.target.value },
    });

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/requirements`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Submission failed");

      alert("🎉 Requirement submitted successfully!");
      setStep(1);
      setFormData({
        eventName: "",
        eventType: "",
        date: "",
        location: "",
        venue: "",
        hireType: "",
        details: {},
      });
    } catch (error) {
      alert("❌ Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF6EE] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative">

        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl z-50">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              Submitting requirement...
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Plan your event!
          </h1>
          <p className="text-gray-500 mt-1">
            Quick and easy event planning
          </p>
        </div>

        <Stepper step={step} />

        {/* STEP 1 */}
        {step === 1 && (
          <Section title="Tell us about your event">
            <Field label="What's the occasion?">
              <Input name="eventName" placeholder="Enter event name" onChange={handleChange} />
            </Field>

            <Field label="Choose event type">
              <Input name="eventType" placeholder="Wedding, Birthday, Corporate…" onChange={handleChange} />
            </Field>

            <Field label="Location">
              <Input name="location" placeholder="Enter location" onChange={handleChange} />
            </Field>

            <PrimaryButton onClick={() => setStep(2)}>
              Next
            </PrimaryButton>
          </Section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Section title="Who do you want to hire?">
            <select
              name="hireType"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a service</option>
              <option value="planner">Event Planner</option>
              <option value="performer">Performer</option>
              <option value="crew">Crew</option>
            </select>

            <PrimaryButton onClick={() => setStep(3)}>
              Next
            </PrimaryButton>
          </Section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Section title="Add more details">
            {formData.hireType === "planner" && (
              <>
                <Input name="budget" placeholder="Expected budget" onChange={handleDetailsChange} />
                <Input name="experience" placeholder="Required experience" onChange={handleDetailsChange} />
              </>
            )}

            {formData.hireType === "performer" && (
              <>
                <Input name="performanceType" placeholder="Performance type" onChange={handleDetailsChange} />
                <Input name="duration" placeholder="Duration" onChange={handleDetailsChange} />
              </>
            )}

            {formData.hireType === "crew" && (
              <>
                <Input name="crewType" placeholder="Crew type" onChange={handleDetailsChange} />
                <Input name="count" placeholder="Number of crew members" onChange={handleDetailsChange} />
              </>
            )}

            <PrimaryButton onClick={() => setStep(4)}>
              Review
            </PrimaryButton>
          </Section>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <Section title="Review your requirement">
            <div className="bg-[#FFF6EE] rounded-xl p-4 text-sm text-gray-700 space-y-1">
              <p><b>Event:</b> {formData.eventName}</p>
              <p><b>Type:</b> {formData.eventType}</p>
              <p><b>Location:</b> {formData.location}</p>
              <p><b>Hiring:</b> {formData.hireType}</p>
            </div>

            <PrimaryButton onClick={submitForm} disabled={loading}>
              {loading ? "Submitting..." : "Submit Requirement"}
            </PrimaryButton>
          </Section>
        )}
      </div>
    </main>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Stepper({ step }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center w-full">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>
            {s}
          </div>
          {s !== 4 && (
            <div className={`flex-1 h-1 ${step > s ? "bg-orange-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-orange-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ name, placeholder, onChange }) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full border rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-xl font-semibold transition 
        ${disabled
          ? "bg-orange-300 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600 text-white"}`}
    >
      {children}
    </button>
  );
}
