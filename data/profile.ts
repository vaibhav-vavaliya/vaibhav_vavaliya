// All site content lives here. Edit this file to update the portfolio.
// Facts come from Vaibhav's CV (public/cv.pdf) and GitHub profile.

export type BrickColor = 'blue' | 'green' | 'yellow' | 'red';
export type Tier = 'gold' | 'silver' | 'bronze' | 'locked';

export const profile = {
  name: 'Vaibhav',
  fullName: 'Vaibhav Vavaliya',
  handle: '@vaibhav-vavaliya',
  role: 'Full stack & backend developer',
  tagline:
    'Full stack & backend developer. I build REST APIs, lock them down with JWT role-based auth, and ship them in containers.',
  location: 'Surat, Gujarat, India',
  email: 'vaibhavvavaliya450@gmail.com',
  cvUrl: '/cv.pdf',
  github: 'https://github.com/vaibhav-vavaliya',
  linkedin: 'https://www.linkedin.com/in/vaibhav-vavaliya',
  links: [
    { label: 'GitHub', href: 'https://github.com/vaibhav-vavaliya' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vaibhav-vavaliya' },
  ],
  spoken: ['English', 'Hindi', 'Gujarati'],
  // Availability chip in the hero and on the avatar card (shown with one pixel heart).
  status: 'Still Alive',
  // What the avatar says when you hover it. The beeps bounce in one by one.
  greeting: { lead: 'Hey! I make computers go', beeps: ['beep', 'boop', 'beep', 'boop', 'beep', 'beep'] },
  // The hero's experience bar: level = months of internship shipped, progress toward the next goal.
  xp: { level: 6, progress: 60, label: 'Months shipped at Visionite Tech', next: 'Next: full-time role' },
  stats: [
    { value: '6 mo', label: 'backend internship' },
    { value: '4', label: 'builds' },
    { value: '20+', label: 'skills unlocked' },
  ],
};

// The About section: a player profile.
export const about = {
  className: 'Full stack & backend developer',
  level: 'Level 6 · Intern alumni',
  paragraphs: [
    "I'm a full stack and backend developer from Surat. For six months I was a Backend Developer Intern at Visionite Tech, designing REST APIs, building JWT role-based auth and API rate limiting, and shipping production websites for live company projects.",
    "My strongest tools are Python, JavaScript/TypeScript and Java, with NestJS, Node.js, Django and Spring Boot on PostgreSQL, MongoDB and Redis, deployed with Docker and Kubernetes. Right now I'm pursuing a B.Tech in IT and building AI-integrated projects and secure backends.",
  ],
  // Self-assessed, out of 10. Shown as segmented stat bars on the player card.
  attributes: [
    { label: 'Backend', value: 8 },
    { label: 'Languages', value: 8 },
    { label: 'Databases', value: 7 },
    { label: 'DevOps', value: 6 },
    { label: 'Frontend', value: 5 },
  ],
  guild: { name: 'Visionite Tech', note: 'Backend intern · Mar–Sep 2026' },
  quests: [
    { kind: 'Main quest', title: 'B.Tech in Information Technology', state: 'In progress' },
    { kind: 'Side quest', title: 'Land a full stack or backend role', state: 'Accepting party invites' },
  ],
};

export type Build = {
  title: string;
  blurb: string;
  stack: string; // main tech, shown under the title
  kind: string; // e.g. "In progress", "Company project", "Personal"
  stats: [string, string]; // two highlights in the card footer
  href?: string; // live demo or repo; cards without one show their status instead of Play
  palette: [BrickColor, BrickColor, BrickColor];
  isNew?: boolean;
};

export const builds: Build[] = [
  {
    title: 'Pulse Guardian',
    blurb: 'Touch-free patient monitoring for wards and ICUs: a bedside hub reads vitals on the device from radar, thermal, camera and audio, and alarms only when a second sensor confirms.',
    stack: 'NestJS · Next.js · Python',
    kind: 'Personal',
    stats: ['On-device vitals', 'Cross-sensor alarms'],
    href: 'https://github.com/vaibhav-vavaliya/PulseGuardain',
    palette: ['green', 'red', 'blue'],
  },
  {
    title: 'Cura',
    blurb: 'A hospital service management system for running hospital services digitally. Designing the backend architecture and REST APIs.',
    stack: 'NestJS',
    kind: 'In progress',
    stats: ['REST APIs', 'Backend architecture'],
    palette: ['blue', 'green', 'red'],
    isNew: true,
  },
  {
    title: 'Role-based auth system',
    blurb: 'Complete authentication and authorization for a live Visionite Tech project: JWT login, and each role reaches only what it is allowed to.',
    stack: 'NestJS',
    kind: 'Company project',
    stats: ['JWT', 'RBAC'],
    palette: ['yellow', 'blue', 'green'],
  },
  {
    title: 'Authentication system',
    blurb: 'A user authentication system with secure backend REST endpoints, built with Express.js on Node.js.',
    stack: 'Node.js · Express.js',
    kind: 'Personal',
    stats: ['REST endpoints', 'Secure login'],
    palette: ['green', 'yellow', 'blue'],
  },
];

export type Badge = { code: string; name: string; tier: Tier };

// Gold = strongest foundation, silver = used on real projects, bronze = working knowledge.
export const badges: Badge[] = [
  { code: 'Py', name: 'Python', tier: 'gold' },
  { code: 'Js', name: 'JavaScript', tier: 'gold' },
  { code: 'Ts', name: 'TypeScript', tier: 'gold' },
  { code: 'Jv', name: 'Java', tier: 'gold' },
  { code: 'Ne', name: 'NestJS', tier: 'silver' },
  { code: 'No', name: 'Node.js', tier: 'silver' },
  { code: 'Ex', name: 'Express.js', tier: 'silver' },
  { code: 'Dj', name: 'Django', tier: 'silver' },
  { code: 'Pg', name: 'PostgreSQL', tier: 'silver' },
  { code: 'Sq', name: 'SQL', tier: 'silver' },
  { code: 'Rd', name: 'Redis', tier: 'silver' },
  { code: 'Dk', name: 'Docker', tier: 'silver' },
  { code: 'K8', name: 'Kubernetes', tier: 'bronze' },
  { code: 'Mg', name: 'MongoDB', tier: 'bronze' },
  { code: 'Re', name: 'React.js', tier: 'bronze' },
  { code: 'Nx', name: 'Next.js', tier: 'bronze' },
  { code: 'Sb', name: 'Spring Boot', tier: 'bronze' },
  { code: 'C', name: 'C', tier: 'bronze' },
  { code: 'C+', name: 'C++', tier: 'bronze' },
  { code: 'C#', name: 'C#', tier: 'bronze' },
  { code: 'Ph', name: 'PHP', tier: 'bronze' },
  { code: 'Hc', name: 'HTML & CSS', tier: 'bronze' },
];

export type Role = {
  title: string;
  place: string;
  period: string;
  note: string;
  color: BrickColor;
};

export const journey: Role[] = [
  {
    title: 'B.Tech, Information Technology',
    place: 'Pursuing',
    period: 'Now',
    note: 'Levelling up on the theory side while building AI-integrated projects and secure backends.',
    color: 'blue',
  },
  {
    title: 'Backend Developer Intern',
    place: 'Visionite Tech, Surat',
    period: 'Mar 2026 — Sep 2026',
    note: 'REST APIs, JWT role-based auth, API rate limiting, SQL + NoSQL database design, Docker + Kubernetes deploys and Redis caching for live projects.',
    color: 'green',
  },
  {
    title: 'Diploma, Information Technology',
    place: 'P P Savani University',
    period: 'Completed',
    note: 'Where the first builds happened.',
    color: 'yellow',
  },
];

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'base', label: 'Base' },
  { id: 'builds', label: 'Builds' },
  { id: 'badges', label: 'Badges' },
  { id: 'journey', label: 'Journey' },
];
