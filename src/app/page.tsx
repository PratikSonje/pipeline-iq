import { auth } from "@clerk/nextjs/server";
import { AnimatedLanding } from "@/components/landing/animated-landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PipelineIQ | The Modern CRM for B2B Sales Teams",
  description: "PipelineIQ is a high-performance, Kanban-first CRM and business pipeline management tool designed to help B2B sales teams close more deals and forecast revenue accurately.",
  openGraph: {
    title: "PipelineIQ | The Modern CRM for B2B Sales Teams",
    description: "Close more deals with absolute clarity using PipelineIQ's Kanban-first CRM.",
    url: "https://pipeline-iq.com",
    siteName: "PipelineIQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PipelineIQ Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PipelineIQ | The Modern CRM for B2B Sales Teams",
    description: "Close more deals with absolute clarity using PipelineIQ's Kanban-first CRM.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://pipeline-iq.com",
  },
};

export default async function Home() {
  const { userId } = await auth();

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PipelineIQ CRM",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is PipelineIQ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PipelineIQ is a modern, Kanban-first CRM software built specifically for B2B sales teams to manage their deals, contacts, and companies."
        }
      },
      {
        "@type": "Question",
        "name": "Is PipelineIQ free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PipelineIQ offers a completely free tier for individuals and small teams to manage their sales pipeline."
        }
      },
      {
        "@type": "Question",
        "name": "How does the Kanban deal board work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Kanban board allows you to visually drag and drop deals through customizable stages, automatically updating your forecasted revenue based on stage probabilities."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AnimatedLanding userId={userId} />
    </>
  );
}
