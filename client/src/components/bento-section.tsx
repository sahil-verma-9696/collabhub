import FeaturePreview from "./bento/feature-preview";

export type BentoSectionProps = {
  title: string;
  description: string;
  Component: React.FC<{ image: string }>;
  image: string;
};

const BentoCard = ({
  title,
  description,
  Component,
  image,
}: BentoSectionProps) => (
  <div className="overflow-hidden rounded-2xl border border-white/20 flex flex-col justify-start items-start relative">
    {/* Background with blur effect */}
    <div
      className="absolute inset-0 rounded-2xl"
      style={{
        background: "rgba(231, 236, 235, 0.08)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    {/* Additional subtle gradient overlay */}
    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-2xl" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7">
          {title} <br />
          <span className="text-muted-foreground">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch h-72 relative -mt-0.5 z-10">
      <Component image={image} />
    </div>
  </div>
);

export function BentoSection() {
  const cards = [
    {
      title: "Real-time team collaboration",
      description:
        "Collaborate with teammates instantly using shared workspaces, live updates, and synced project activity.",
      image: "/dashboard-preview.png",
      Component: FeaturePreview,
    },
    {
      title: "Smart task management",
      description:
        "Organize tasks with boards, priorities, deadlines, labels, and progress tracking in one place.",
      image: "/task-preview.png",
      Component: FeaturePreview,
    },
    {
      title: "Workspace activity tracking",
      description:
        "Track every important action across projects with a centralized activity feed and audit logs.",
      image: "/activity-preview.png",
      Component: FeaturePreview,
    },
    {
      title: "Role-based member management",
      description:
        "Invite members, assign roles, and securely manage workspace access with permission controls.",
      image: "/members-preview.png",
      Component: FeaturePreview,
    },
    {
      title: "Integrated team communication",
      description:
        "Discuss ideas, share updates, and collaborate smoothly with built-in communication channels.",
      image: "/chat-preview.png",
      Component: FeaturePreview,
    },
    {
      title: "Project and document collaboration",
      description:
        "Manage projects, share documents, and keep your entire team aligned from planning to delivery.",
      image: "/dashboard-preview.png",
      Component: FeaturePreview,
    },
  ];

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-136.75 h-234.5 absolute top-153.5 left-20 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-166 text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-16.5">
              Empower Your Workflow with team
            </h2>
            <p className="w-full max-w-150 text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Connect with team for real-time collaboration, seamless
              integrations, and actionable insights to streamline your
              operations.
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
