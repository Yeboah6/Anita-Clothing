import { useState } from "react";
import { router } from "@inertiajs/react";

export function useNewsletterSubscribe() {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const subscribe = (email, { onSuccess } = {}) => {
    setSubmitting(true);
    setFeedback(null);

    router.post(
      "/newsletter/subscribe",
      { email },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          const status = page.props.flash?.newsletter_status;
          setFeedback({
            type: "success",
            message: status === "already_subscribed" ? "You're already on the list!" : "Thanks for subscribing!",
          });
          onSuccess?.();
        },
        onError: (errors) => {
          setFeedback({ type: "error", message: errors.email || "Something went wrong. Please try again." });
        },
        onFinish: () => setSubmitting(false),
      }
    );
  };

  return { subscribe, submitting, feedback };
}