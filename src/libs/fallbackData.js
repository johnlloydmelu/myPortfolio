export const fallbackProjects = [
  {
    id: 'fb-carewatch',
    title: 'CareWatch',
    slug: 'carewatch',
    summary:
      'A health-monitoring dashboard that helps caregivers track patient vitals and respond to alerts quickly.',
    description:
      'CareWatch gives caregivers a single place to monitor patients, review vitals trends, and receive prioritised alerts. Built with a focus on clarity, accessibility, and secure role-based data access.',
    tech_stack: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel'],
    github_url: 'https://github.com/your-username/carewatch',
    live_url: 'https://carewatch.example.com',
    featured: true,
    published: true,
    sort_order: 0,
  },
  {
    id: 'fb-network',
    title: 'Network Inventory Tracker',
    slug: 'network-inventory-tracker',
    summary:
      'Asset and device inventory tool for small IT teams with search, tagging, and CSV export.',
    tech_stack: ['React', 'Node.js', 'PostgreSQL'],
    github_url: 'https://github.com/your-username/network-inventory-tracker',
    live_url: null,
    featured: false,
    published: true,
    sort_order: 1,
  },
  {
    id: 'fb-helpdesk',
    title: 'Helpdesk Ticketing Lite',
    slug: 'helpdesk-ticketing-lite',
    summary:
      'Lightweight ticketing system with status workflow, priorities and email notifications.',
    tech_stack: ['JavaScript', 'Supabase', 'Tailwind CSS'],
    github_url: 'https://github.com/your-username/helpdesk-ticketing-lite',
    live_url: null,
    featured: false,
    published: true,
    sort_order: 2,
  },
  {
    id: 'fb-monitor',
    title: 'Server Health Monitor',
    slug: 'server-health-monitor',
    summary:
      'Scripts and dashboard for tracking uptime, CPU, memory and disk usage across Linux hosts.',
    tech_stack: ['Linux', 'Bash', 'Python', 'Grafana'],
    github_url: 'https://github.com/your-username/server-health-monitor',
    live_url: null,
    featured: false,
    published: true,
    sort_order: 3,
  },
]

export const fallbackSkills = [
  { id: 's1', name: 'JavaScript', category: 'Frontend', level: 90, sort_order: 0 },
  { id: 's2', name: 'React', category: 'Frontend', level: 88, sort_order: 1 },
  { id: 's3', name: 'Tailwind CSS', category: 'Frontend', level: 90, sort_order: 2 },
  { id: 's4', name: 'HTML & CSS', category: 'Frontend', level: 92, sort_order: 3 },
  { id: 's5', name: 'Node.js', category: 'Backend', level: 78, sort_order: 0 },
  { id: 's6', name: 'PostgreSQL', category: 'Backend', level: 80, sort_order: 1 },
  { id: 's7', name: 'Supabase', category: 'Backend', level: 82, sort_order: 2 },
  { id: 's8', name: 'REST APIs', category: 'Backend', level: 85, sort_order: 3 },
  { id: 's9', name: 'Git & GitHub', category: 'DevOps & Tools', level: 88, sort_order: 0 },
  { id: 's10', name: 'Vercel', category: 'DevOps & Tools', level: 80, sort_order: 1 },
  { id: 's11', name: 'Linux', category: 'DevOps & Tools', level: 75, sort_order: 2 },
  { id: 's12', name: 'Networking Basics', category: 'DevOps & Tools', level: 72, sort_order: 3 },
]