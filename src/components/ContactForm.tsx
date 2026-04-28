"use client";

import { useState, useRef } from "react";

const FORMSPREE = "https://formspree.io/f/xbdpbrjg";

type FieldState = "idle" | "invalid";
type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [nameState, setNameState]   = useState<FieldState>("idle");
  const [emailState, setEmailState] = useState<FieldState>("idle");
  const [msgState, setMsgState]     = useState<FieldState>("idle");

  const formRef = useRef<HTMLFormElement>(null);

  const validateName  = (v: string) => v.trim().length >= 2;
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const validateMsg   = (v: string) => v.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nameVal  = (data.get("name")    as string) ?? "";
    const emailVal = (data.get("email")   as string) ?? "";
    const msgVal   = (data.get("message") as string) ?? "";

    const nameOk  = validateName(nameVal);
    const emailOk = validateEmail(emailVal);
    const msgOk   = validateMsg(msgVal);

    setNameState(nameOk   ? "idle" : "invalid");
    setEmailState(emailOk ? "idle" : "invalid");
    setMsgState(msgOk     ? "idle" : "invalid");

    if (!nameOk || !emailOk || !msgOk) return;

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-feedback success visible" aria-live="polite">
        <span className="feedback-icon">✓</span>
        <div>
          <div className="feedback-title">Message sent!</div>
          <div className="feedback-sub">Thanks for reaching out — I&apos;ll get back to you soon.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="f-name">Name</label>
            <input
              id="f-name" name="name" type="text"
              placeholder="Your name" required
              className={nameState === "invalid" ? "invalid" : ""}
              onChange={(e) => { if (nameState === "invalid") setNameState(validateName(e.target.value) ? "idle" : "invalid"); }}
              onBlur={(e)   => setNameState(validateName(e.target.value) ? "idle" : "invalid")}
            />
            {nameState === "invalid" && (
              <span className="field-error visible">Please enter your name (min 2 characters)</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="f-email">Email</label>
            <input
              id="f-email" name="email" type="email"
              placeholder="your@email.com" required
              className={emailState === "invalid" ? "invalid" : ""}
              onChange={(e) => { if (emailState === "invalid") setEmailState(validateEmail(e.target.value) ? "idle" : "invalid"); }}
              onBlur={(e)   => setEmailState(validateEmail(e.target.value) ? "idle" : "invalid")}
            />
            {emailState === "invalid" && (
              <span className="field-error visible">Please enter a valid email address</span>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="f-subject">Subject</label>
          <input id="f-subject" name="subject" type="text" placeholder="What's this about?" />
        </div>
        <div className="form-group">
          <label htmlFor="f-msg">Message</label>
          <textarea
            id="f-msg" name="message"
            placeholder="Tell me more..." required
            className={msgState === "invalid" ? "invalid" : ""}
            onChange={(e) => { if (msgState === "invalid") setMsgState(validateMsg(e.target.value) ? "idle" : "invalid"); }}
            onBlur={(e)   => setMsgState(validateMsg(e.target.value) ? "idle" : "invalid")}
          />
          {msgState === "invalid" && (
            <span className="field-error visible">Please enter a message (min 10 characters)</span>
          )}
        </div>
        <button type="submit" className="form-submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send Message →"}
        </button>
      </form>

      {status === "error" && (
        <div className="form-feedback error visible" aria-live="polite">
          <span className="feedback-icon">✕</span>
          <div>
            <div className="feedback-title">Something went wrong</div>
            <div className="feedback-sub">Please try again or email me directly.</div>
          </div>
        </div>
      )}
    </>
  );
}
