import { getSiteManifest } from "../lib/mediaResolver";

export interface Author {
  name: string;
  avatarRef: string;
  portraitRef: string;
  bio: string;
  socials: {
    id: string;
    label: string;
    handle: string;
    urlRef: string;
  }[];
}

export type ArticleCategory = "sam" | "design";

export interface ArticleBullet {
  label?: string;
  text: string;
}

export interface ArticleTable {
  headers: string[];
  rows: string[][];
}

export interface ArticleCodeBlock {
  language: string;
  label?: string;
  content: string;
}

export interface ArticleCallout {
  label: string;
  text: string;
}

export interface ArticleSection {
  heading?: string;
  subheading?: string;
  paragraphs?: string[];
  bullets?: ArticleBullet[];
  table?: ArticleTable;
  code?: ArticleCodeBlock;
  callout?: ArticleCallout;
  quote?: {
    quote: string;
    author?: string;
    source?: string;
  };
  imageRef?: string;
  galleryRefs?: string[];
}

export interface Article {
  id: string;
  slug: string;
  canonicalPath?: string;
  title: string;
  excerpt: string;
  coverImageRef: string;
  date: string;
  year: string;
  readTime: string;
  category: ArticleCategory;
  categoryLabel: string;
  location?: string;
  author: Author;
  tags: string[];
  sections: ArticleSection[];
}

const manifest = getSiteManifest();

export const defaultAuthor: Author = {
  name: manifest.author.name,
  avatarRef: manifest.author.avatarRef,
  portraitRef: manifest.author.portraitRef,
  bio: manifest.author.bio,
  socials: manifest.contact.socials,
};

export const photographyRefs: string[] = [
  "media://cover-structured-decisions",
  "media://cover-asbd-hero",
  "media://cover-infra-cookbooks",
  "media://cover-native-runtime",
  "media://cover-ux-principles",
  "media://cover-cms-platform",
  "media://author-portrait",
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "structured-decisions",
    canonicalPath: "/docs/sam/structured-decisions/",
    title: "Stop Making LLMs Improvise Everything: How AgentSam Uses Typed Decision Primitives",
    excerpt:
      "Large language models are extraordinary at open-ended reasoning and code generation. Here is how Systematic Autonomous Machinery (SAM) handles deterministic routing, scoring, confidence checks, and policy gates.",
    coverImageRef: "media://cover-structured-decisions",
    date: "November 10, 2026",
    year: "2026",
    readTime: "10 min read",
    category: "sam",
    categoryLabel: "Agent Architecture",
    location: "/docs/sam/structured-decisions/",
    author: defaultAuthor,
    tags: ["Agent Architecture", "SAM", "TypeScript"],
    sections: [
      {
        paragraphs: [
          "Large language models are extraordinary at open-ended reasoning, code generation, tool use, and explaining complex bugs. What they should not be doing is improvising routine routing, risk scoring, or policy enforcement in free-form prose.",
          "Asking an LLM to repeatedly guess which terminal lane to use or whether a deployment is safe introduces latency, token waste, and unpredictability. AgentSam solves this by pairing generative AI with Systematic Autonomous Machinery (SAM)—a fast, deterministic, typed decision layer that handles routing, scoring, confidence checks, and policy gates before software takes action."
        ],
        callout: {
          label: "The Core Principle",
          text: "Use the LLM for open-ended reasoning and generation; use typed decision primitives whenever the answer must fit a known shape and directly control system behavior."
        },
        code: {
          language: "plaintext",
          label: "Execution Architecture",
          content: `user / repo / runtime / tool state
                 │
                 ▼
         AgentSam context
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
 LLM reasoning       typed decision
 • explain           • choose
 • plan              • score
 • generate          • gate
 • edit              • rank
 • call tools        • confidence
       │                   │
       └─────────┬─────────┘
                 ▼
            action / tool
                 │
                 ▼
     terminal · skill · model
     retrieval · workflow · deploy`
        }
      },
      {
        heading: "1. This Is Not Another Chat Model",
        paragraphs: [
          "The structured decision layer is never responsible for holding a conversation, scaffolding a React component, or authoring a database migration. Those remain pure LLM jobs.",
          "Instead, its responsibility is tightly bounded: receive an explicit machine state, evaluate a constrained question, and return a typed result that software can execute immediately without parsing prose."
        ],
        table: {
          headers: ["Engineering Question", "Execution Layer", "Why"],
          rows: [
            [
              "\"Explain why this terminal session failed.\"",
              "LLM",
              "Requires open-ended synthesis and human-readable diagnosis."
            ],
            [
              "\"Which execution lane should handle this command?\"",
              "choice primitive",
              "Finite set of known runtime targets (local, remote, sandbox)."
            ],
            [
              "\"How risky is this deployment?\"",
              "score primitive",
              "Maps observable repo and test metrics onto a bounded numeric rubric."
            ],
            [
              "\"Is confidence high enough to act without asking?\"",
              "gate primitive",
              "Converts risk, reversibility, and policy into an explicit permission check."
            ],
            [
              "\"Rewrite this package boundary cleanly.\"",
              "LLM + Tools",
              "Requires multi-file code generation and architectural judgment."
            ]
          ]
        }
      },
      {
        heading: "2. Where Typed Decisions Fit Inside AgentSam",
        paragraphs: [
          "Wherever possible outputs are constrained to a finite set or numeric rubric, AgentSam replaces open-ended generation with structured evaluation:"
        ],
        bullets: [
          { label: "Skills", text: "Select the exact skill, slash route, or workflow from a known registry." },
          { label: "Terminal", text: "Choose between local, remote, or sandbox execution based on observed machine health." },
          { label: "Retrieval", text: "Route queries to memory, AST-RAG, documentation, repository indexes, or skip retrieval altogether." },
          { label: "Models", text: "Route tasks across fast, standard, heavy reasoning, or local offline models." },
          { label: "Deploy", text: "Score release readiness and enforce verification or human approval gates." },
          { label: "Planning", text: "Rank candidate actions during Goal-Oriented Action Planning (GOAP) or utility-based execution." }
        ]
      },
      {
        heading: "3. The Five Decision Primitives",
        subheading: "Primitive 1: State",
        paragraphs: [
          "Decisions must be grounded in explicit, machine-readable facts rather than hidden prompt assumptions. A state object combines repository status, runtime health, user intent, tool availability, cost budgets, and security policies."
        ],
        code: {
          language: "typescript",
          label: "decision-state.ts",
          content: `const state = {
  intent: "inspect_repository",
  repo: { dirty: true, tests: "unknown", packageCount: 31 },
  terminal: { local: "healthy", remote: "healthy", sandbox: "available" },
  policy: { allowProductionWrite: false }
};`
        }
      },
      {
        subheading: "Primitive 2: Choice",
        paragraphs: [
          "A choice selects one winner from a finite candidate list when AgentSam already knows the legal options—such as picking a retrieval lane, terminal target, or model class."
        ],
        code: {
          language: "json",
          label: "choice-result.json",
          content: `{
  "question": "Which execution lane should run this task?",
  "options": ["local", "remote", "sandbox"],
  "result": "local",
  "confidence": 0.94
}`
        }
      },
      {
        subheading: "Primitive 3: Score",
        paragraphs: [
          "A score maps current state onto a normalized 0..1 rubric. Numeric scoring lets AgentSam compare competing actions mathematically or enforce hard thresholds without coaxing an LLM into emitting JSON-shaped prose."
        ],
        code: {
          language: "typescript",
          label: "utility.ts",
          content: `type ActionScore = {
  action: string;
  utility: number;       // 0..1
  risk: number;          // 0..1
  cost: number;          // 0..1
  reversibility: number; // 0..1
};`
        }
      },
      {
        subheading: "Primitive 4: Gate",
        paragraphs: [
          "A gate turns a structured assessment into explicit permission to proceed. Gates protect high-consequence operations: production writes, secret rotations, package releases, destructive database migrations, or expensive long-running jobs."
        ],
        code: {
          language: "plaintext",
          label: "Permission Gate Flow",
          content: `candidate action
     │
     ▼
risk score ───────┐
confidence ───────┤
tests/status ─────┤──► gate policy ──► allow
approval state ───┤                 └─► ask user
reversibility ────┘                 └─► deny`
        }
      },
      {
        subheading: "Primitive 5: Confidence",
        paragraphs: [
          "Confidence is not a substitute for correctness—it is a routing signal. What matters is how AgentSam adapts its behavior when certainty drops:"
        ],
        table: {
          headers: ["Confidence Level", "System Behavior"],
          rows: [
            ["High", "Proceed automatically when policy allows; record the decision and supporting evidence as a receipt."],
            ["Medium", "Gather one additional piece of evidence, run a fast verification check, or compare top alternatives."],
            ["Low", "Escalate to the user, defer execution, or route the problem to a stronger reasoning model."]
          ]
        }
      },
      {
        heading: "4. Six Production Patterns for Autonomous Workflows",
        bullets: [
          {
            label: "Pattern A — Intent Routing",
            text: "Classify incoming requests into a known execution family (code, research, terminal, database, deploy, design, document) before invoking heavy language models."
          },
          {
            label: "Pattern B — Utility Scoring",
            text: "When multiple candidate actions can advance a goal, utility scoring lets them compete transparently using explicit, configurable policy weights rather than hidden prompt magic."
          },
          {
            label: "Pattern C — GOAP Action Selection",
            text: "Goal-Oriented Action Planning generates valid action sequences from preconditions and effects, then ranks candidate plans mathematically."
          },
          {
            label: "Pattern D — Retrieval Routing",
            text: "Route each question to its authoritative corpus first—AST graph for symbols, memory for past decisions, repo docs for contracts, fresh web docs for provider support."
          },
          {
            label: "Pattern E — Terminal Lane Selection",
            text: "Inspect file locality, trust boundaries, and machine availability to pick between local, remote, and sandbox execution."
          },
          {
            label: "Pattern F — Dynamic Approval Gates",
            text: "Low risk + reversible + high confidence executes immediately; high consequence or irreversible requires explicit human approval."
          }
        ],
        code: {
          language: "typescript",
          label: "Utility Formula",
          content: `utility =
  (goalProgress  * 0.40) +
  (confidence    * 0.20) +
  (reversibility * 0.15) +
  (speed         * 0.15) -
  (risk          * 0.25) -
  (cost          * 0.10);`
        }
      },
      {
        heading: "5. Real-World AgentSam Applications & Eight Design Rules",
        paragraphs: [
          "Across skill selection, fail-closed model tier routing, and package release gates, keeping structured control separate from generative synthesis keeps behavior fast, auditable, and resilient."
        ],
        table: {
          headers: ["Task Shape", "Recommended Model Class"],
          rows: [
            ["Small edit, extraction, or classification", "fast"],
            ["Standard coding and multi-step planning", "standard"],
            ["Deep architectural reasoning", "reasoning / heavy"],
            ["Private, local, or offline work", "local (when capable)"]
          ]
        },
        bullets: [
          { label: "01. Constrain the output space", text: "Use typed decisions only when legal outputs are genuinely bounded." },
          { label: "02. Keep state explicit", text: "Never bury critical runtime facts inside sprawling system prompts." },
          { label: "03. Separate confidence from permission", text: "High confidence never grants authority on its own—policy gates do." },
          { label: "04. Prefer deterministic checks", text: "Never use learned judgment when a direct test or static check exists." },
          { label: "05. Reserve LLMs for synthesis", text: "Keep generative models focused on code creation, explanation, and complex reasoning." },
          { label: "06. Record decisions as receipts", text: "Every candidate set, chosen result, score, policy, and evidence source must remain inspectable." },
          { label: "07. Escalate uncertainty", text: "Low confidence should automatically trigger evidence gathering, model escalation, or user input." },
          { label: "08. Decouple control from presentation", text: "CLI, Studio, and mobile interfaces can render the exact same underlying decision receipt differently." }
        ],
        imageRef: "media://cover-asbd-hero"
      }
    ]
  },
  {
    id: "2",
    slug: "infrastructure-cookbooks",
    canonicalPath: "/docs/sam/infrastructure-cookbooks/",
    title: "Beyond Brute-Force Prompting: 9 Engineering Drills to Prove Your Agent Understands Large Codebases",
    excerpt:
      "A command exiting with code 0 does not prove an autonomous coding agent did good work. Nine hands-on drills and a 10-point scorecard to benchmark precision, blast radius, and restraint.",
    coverImageRef: "media://cover-infra-cookbooks",
    date: "November 6, 2026",
    year: "2026",
    readTime: "12 min read",
    category: "sam",
    categoryLabel: "Systematic Autonomous Machinery",
    location: "/docs/sam/infrastructure-cookbooks/",
    author: defaultAuthor,
    tags: ["SAM", "Benchmarking", "Infrastructure"],
    sections: [
      {
        paragraphs: [
          "A command completing with exit code 0 does not prove an autonomous coding agent did good work. In complex repositories, brute-force LLM exploration burns massive token budgets, modifies unrelated files, and introduces subtle boundary regressions.",
          "True machine intelligence is measured by restraint and precision: Did the system identify the smallest affected code surface before editing, preserve unrelated work, and back every change with verifiable proof? These 9 hands-on drills benchmark AgentSam’s machine layer across real infrastructure tasks."
        ],
        callout: {
          label: "The Golden Rule of SAM Testing",
          text: "Never judge success by whether a command ran. Judge success by whether SAM changed the intended state while leaving unrelated authority untouched."
        },
        code: {
          language: "plaintext",
          label: "SAM Perception & Receipt Pipeline",
          content: `human goal
   │
   ▼
SAM perception
   ├─ repository state
   ├─ Merkle delta
   ├─ AST / dependency graph
   ├─ indexed retrieval
   └─ runtime health
   │
   ▼
plan / execute / verify
   │
   ▼
work receipt
   ├─ predicted vs. actual impact
   ├─ focused tests & verification
   └─ remaining uncertainty`
        }
      },
      {
        heading: "Drills 01–04: Baseline, Merkle Deltas, Blast Radius & Retrieval",
        paragraphs: [
          "Before editing a line of code, SAM captures a reproducible repository baseline, proves Merkle diffs isolate modified subtrees without redundant indexing, and routes queries to the highest-signal index."
        ],
        code: {
          language: "bash",
          label: "Baseline & Merkle Snapshot Drills",
          content: `git status --short
git rev-parse HEAD

agentsam inspect

agentsam merkle snapshot . \\
  --semantic \\
  --out /tmp/sam-before.json

agentsam index plan --cwd . --json
agentsam index run --cwd . --json
agentsam search "terminal enrollment authentication" \\
  --cwd . --top-k 8 --token-budget 4000`
        },
        table: {
          headers: ["Question Category", "Highest-Signal Retrieval Mode"],
          rows: [
            ["Exact symbol, function, or import", "AST / Structural"],
            ["Downstream dependency or reachability", "Dependency Graph"],
            ["High-level architectural concept", "Semantic Embeddings"],
            ["Past architectural decision or context", "Memory / Work History"]
          ]
        }
      },
      {
        heading: "Drills 05–09: GOAP Planning, Release Gates, Security & Recovery",
        bullets: [
          { label: "Drill 05 — Deterministic GOAP Planning", text: "Identical repository states yield identical plans, costs, and preconditions via `agentsam brand plan --goap --json`." },
          { label: "Drill 06 — Package-Release Torture Test", text: "Single-point failures in exports, pack checks, or boundary checks are isolated directly by native repo scripts." },
          { label: "Drill 07 — Security & Trust-Boundary Drill", text: "Combines AST and Merkle evidence (`agentsam security scan --path . --json`) to catch client/server leaks early." },
          { label: "Drill 08 — Local vs. Remote Parity", text: "Verifies git HEAD, node version, and working tree status before treating execution lanes as interchangeable." },
          { label: "Drill 09 — Failure-Recovery Loop", text: "Targeted stage classification and evidence extraction rather than speculative multi-file rewrites." }
        ],
        code: {
          language: "bash",
          label: "Package Release Torture Suite",
          content: `npm run verify:package
npm run pack:check
npm run test:workspaces
npm run verify:boundaries
npm run verify:release`
        }
      },
      {
        heading: "Reusable Operator Prompt & 10-Point SAM Benchmark Scorecard",
        paragraphs: [
          "When tackling high-stakes infrastructure migrations—such as identity authority moves, terminal runtime upgrades, or release pipeline changes—enforce the full Inspect → Implement → Verify → Receipt lifecycle."
        ],
        table: {
          headers: ["Dimension", "Core Evaluation Question"],
          rows: [
            ["1. Perception", "Did SAM identify the exact authority surface before editing?"],
            ["2. Precision", "How little irrelevant code did it inspect?"],
            ["3. Incrementality", "Did it reuse prior Merkle/index evidence instead of repeating work?"],
            ["4. Planning", "Did it compute a minimal, valid execution path?"],
            ["5. Execution", "Did it select the optimal terminal lane and toolset?"],
            ["6. Recovery", "Did it narrow failures methodically before modifying code?"],
            ["7. Verification", "Did it prove the final state with focused tests and diffs?"],
            ["8. Scope Control", "Did actual modified files match the predicted blast radius?"],
            ["9. Cost", "Total tool calls, model tokens, embeddings, and wall-clock time."],
            ["10. Friction", "How little internal SAM jargon did the human operator need to know?"]
          ]
        },
        callout: {
          label: "The Ultimate Product Test",
          text: "A technically brilliant primitive that forces users to memorize twelve CLI flags has not finished becoming a product. Great UX hides Merkle graphs, AST walkers, and GOAP solvers behind clear progress states—exposing the underlying machinery only when the operator explicitly asks /why."
        }
      }
    ]
  },
  {
    id: "3",
    slug: "native-runtime",
    canonicalPath: "/docs/sam/native-runtime/",
    title: "Go Where Machine Work Benefits From Go: Inside AgentSam’s Hybrid Edge-to-Local Runtime",
    excerpt:
      "TypeScript remains the single protocol contract authority while a native Go runtime executes high-frequency SHA-256 hashing, static inspections, and persistent daemon work.",
    coverImageRef: "media://cover-native-runtime",
    date: "November 2, 2026",
    year: "2026",
    readTime: "7 min read",
    category: "sam",
    categoryLabel: "Runtime & Systems Engineering",
    location: "/docs/sam/native-runtime/",
    author: defaultAuthor,
    tags: ["Go", "Cloudflare Workers", "Runtime"],
    sections: [
      {
        paragraphs: [
          "TypeScript excels at protocol schemas, developer ergonomics, and high-level agent orchestration. However, when an autonomous system needs to compute deterministic SHA-256 hashes across thousands of files, run high-frequency static inspections, or manage persistent local daemons, raw systems performance matters.",
          "AgentSam bridges both worlds through a clean architectural boundary: the TypeScript protocol layer remains the single contract authority, while a native Go runtime executes performance-critical machine work."
        ],
        callout: {
          label: "Current Production Shape",
          text: "Cloudflare Worker edge adapter → native Linux Go Container—with the exact same runtime core engineered to power the local agentsamd user-machine daemon."
        }
      },
      {
        heading: "1. What the Native Go Runtime Delivers Today",
        bullets: [
          { label: "System Introspection", text: "Reports real-time runtime health, cryptographic source identity, environment metadata, and supported capabilities." },
          { label: "Deterministic SHA-256 Hashing", text: "Computes fast, repeatable content digests across files and workspace artifacts." },
          { label: "Deterministic Static Inspection", text: "Performs rapid, zero-ambiguity structural checks on repository files without spinning up heavy language servers." },
          { label: "Unified Error Contracts", text: "Returns structured failures conforming strictly to the AgentSam ErrorEnvelope schema so upstream TypeScript orchestrators handle errors predictably." }
        ]
      },
      {
        heading: "2. Three Deployment & Ownership Modes, One Shared Contract",
        paragraphs: [
          "Whether running on a maintainer's laptop, inside a local Wrangler dev loop, or at the Cloudflare edge, the Go binary adheres to the exact same behavioral contract."
        ],
        bullets: [
          { label: "Mode 1 — Local Native Development", text: "Compile and run directly on bare metal with an automated handshake verifying source identity matches the active repository." },
          { label: "Mode 2 — Cloudflare Edge Development", text: "Wrangler runs the TypeScript Worker edge adapter bound to the GO_RUNTIME Container for pre-flight integration verification." },
          { label: "Mode 3 — Hosted & Self-Hosting", text: "Standard users consume the managed hosted service seamlessly; advanced self-hosters deploy explicitly with dry-run checks." }
        ],
        code: {
          language: "bash",
          label: "Self-Hosted Edge Deployment",
          content: `agentsam go --cloudflare agentsam-go-worker --dry-run --account <account-id>`
        }
      },
      {
        heading: "3. What Actually Counts as Shipped: The Production Receipt Standard",
        paragraphs: [
          "In AgentSam’s release architecture, a passing build, a valid Dockerfile, or a deployment script does not count as proof of deployment. A production release is accepted only after the externally reachable endpoint reports healthy and both the edge Worker and the underlying native Go binary confirm matching source identities."
        ],
        bullets: [
          { label: "Source Provenance", text: "Git commit or npm package identity paired with a deterministic source digest." },
          { label: "Binary Integrity", text: "Native compiled Go binary SHA-256 checksum." },
          { label: "Container Hardening", text: "linux/amd64 non-root container execution verification." },
          { label: "Cloudflare Identity", text: "Explicit Cloudflare account ID, deployment ID, and Worker version ID." },
          { label: "Live Verification", text: "Deployed public URL backed by timestamped health and capability endpoint probes." }
        ],
        quote: {
          quote: "agentsamd will embed this exact Go core directly on user machines for ultra-low-latency local execution, while the hosted Go Worker continues operating as a cleanly isolated cloud service."
        }
      }
    ]
  },
  {
    id: "4",
    slug: "essential-ux-design-principles",
    title: "The 7 Essential UX Design Principles: A Master Guide for Developers & Designers",
    excerpt:
      "A canonical reference covering User-Centricity, Consistency, Hierarchy, Context, User Control, Accessibility, and Usability—plus the Clay-style editorial structure for dual human and AI audiences.",
    coverImageRef: "media://cover-ux-principles",
    date: "October 28, 2026",
    year: "2026",
    readTime: "9 min read",
    category: "design",
    categoryLabel: "UI/UX & Editorial Systems",
    author: defaultAuthor,
    tags: ["UX Design", "Editorial", "Architecture"],
    sections: [
      {
        paragraphs: [
          "Mastering user experience (UX) design comes down to a core set of universal principles. Whether you are architecting a high-density mobile app, designing a dashboard, or planning an AI-powered assistant, these foundational rules ensure you put your end-users first."
        ],
        bullets: [
          {
            label: "1. User-Centricity",
            text: "Put real user needs and behaviors ahead of internal assumptions. Like Google Docs' AI writing assistant, surface suggestions transparently in context and require explicit user action to accept or refine."
          },
          {
            label: "2. Consistency",
            text: "Reduce cognitive load across screens and related tools. Shared visual language across Google Workspace lets users transfer knowledge effortlessly without relearning patterns."
          },
          {
            label: "3. Hierarchy",
            text: "Guide the eye from primary actions to progressive disclosure—just as Stripe keeps high-level user goals prominent while tucking granular developer specs deeper down."
          },
          {
            label: "4. Context",
            text: "Adapt dynamically to environment, lighting, and device limits—like Google Maps shifting between high-contrast driving blocks and intricate walking layouts."
          },
          {
            label: "5. User Control",
            text: "Provide clear visibility and frictionless emergency exits to undo mistakes or override automated choices."
          },
          {
            label: "6. Accessibility",
            text: "Design high-contrast palettes, scalable typography, and keyboard tab-orders from day one—never treat WCAG compliance as a post-launch patch."
          },
          {
            label: "7. Usability",
            text: "Usability always trumps decoration across five core pillars: Learnability, Efficiency, Memorability, Error Recovery, and Satisfaction."
          }
        ]
      },
      {
        heading: "AI & Emerging Tech: Do These Principles Still Apply?",
        paragraphs: [
          "Yes. As artificial intelligence, multimodal interfaces, and automated workflows alter the digital landscape, these 7 core principles become even more critical. When AI generates content dynamically behind the scenes, leaning heavily on Hierarchy (what to show first), User Control (overriding automation), and Consistency (predictable UI patterns) keeps users feeling empowered rather than replaced."
        ],
        callout: {
          label: "The Anatomy of a Clay-Style Design Article",
          text: "Start with a high-impact editorial hook, break ideas into modular numbered blocks (3–4 lines max per paragraph), pair every section with real-world product proof, and close with an actionable Golden Rule."
        }
      },
      {
        heading: "Writing for Dual Audiences: Humans & AI Agents",
        paragraphs: [
          "Structured tutorials work brilliantly for both human readers and modern AI collaborators because they are scannable and token-friendly. Use crisp Markdown headings, explicit bullet lists, bolded terminology (Cognitive Load, Visual Hierarchy), and clear callout rules so every published essay doubles as canonical architectural context."
        ],
        galleryRefs: [
          "media://cover-ux-principles",
          "media://cover-cms-platform",
          "media://cover-structured-decisions"
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "asbd-design-system",
    title: "ASBD Dual-Mode Color Spec & AgentSam Learn Hero Architecture",
    excerpt:
      "Calibrating WCAG AA-compliant violet accents across light and dark surfaces, syncing user appearance preferences with zero flash, and composing an asymmetric split media hero.",
    coverImageRef: "media://cover-asbd-hero",
    date: "October 22, 2026",
    year: "2026",
    readTime: "8 min read",
    category: "design",
    categoryLabel: "Design Systems & Tokens",
    author: defaultAuthor,
    tags: ["Design Systems", "CSS Tokens", "Hero Spec"],
    sections: [
      {
        paragraphs: [
          "The ASBD theme system calibrates light-mode surface tokens (#F8FAFC / #ECEFF4) and deep obsidian dark surfaces (#050507 / #0D0D11) with WCAG AA-compliant violet accents (6.1:1 contrast ratio on light surfaces, 7.2:1 on dark surfaces), while keeping global header and footer chrome invariant."
        ],
        table: {
          headers: ["Token Variable", "Light Mode", "Dark Mode", "Component Usage"],
          rows: [
            ["--asbd-bg", "#F8FAFC", "#050507", "Primary canvas background & left nav rail"],
            ["--asbd-surface", "#ECEFF4", "#0D0D11", "Code blocks, command rows & inset cards"],
            ["--asbd-border", "#D5DCE6", "#222229", "1px column dividers, card outlines & rules"],
            ["--asbd-accent", "#6842FF", "#9D86E9", "Eyebrows, active links, breadcrumbs & focus rings"],
            ["--asbd-text-primary", "#0F172A", "#FFFFFF", "H1–H3 headings, active breadcrumbs & titles"],
            ["--asbd-text-body", "#334155", "#D4D4DA", "Standard paragraph prose & list items"]
          ]
        }
      },
      {
        heading: "Zero-Flash Appearance Sync",
        paragraphs: [
          "Bind colorMode (\"system\" | \"light\" | \"dark\") to the authenticated user's Appearance Settings record and execute a synchronous <head> boot script before stylesheets render so no session flashes between themes on load."
        ],
        code: {
          language: "typescript",
          label: "user-preferences.ts",
          content: `export type ColorModePreference = "system" | "light" | "dark";

const STORAGE_KEY = "ia.appearance.colorMode";

export function applyUserColorMode(mode: ColorModePreference): void {
  const root = document.documentElement;
  localStorage.setItem(STORAGE_KEY, mode);

  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}`
        }
      },
      {
        heading: "AgentSam Learn: Asymmetric Split-Composition Media Hero",
        paragraphs: [
          "On AgentSam Learn, the hero pairs an art-directed <picture> backdrop of an exploded 3D mechanical assembly composed on the right 60% of the frame with a left-to-right midnight-navy legibility scrim (#060A14 at 94% down to 12%) and tight stacked display typography (Design. / Create. / Ship.) with two-tone periods."
        ],
        bullets: [
          { label: "Primary Button (Open Workbench)", text: "Cool metallic slate-silver (#9AA6B6) with deep obsidian ink (#090D16) and 10px soft-squircle corners." },
          { label: "Secondary Button (Browse modules)", text: "Translucent smoked glass (rgba(15, 23, 42, 0.55)) with blur(8px) and hairline slate border." },
          { label: "Sub-Hero Path Dock", text: "5-item horizontal row (Themes, SDK, Knowledge, CAD, Cloud) rendered as 42px × 42px rounded-square glass tiles." }
        ],
        imageRef: "media://cover-asbd-hero"
      }
    ]
  },
  {
    id: "6",
    slug: "cms-footer-and-asset-architecture",
    title: "Multi-Domain CMS Sections: Separating Platform Chrome from Merchant Themes",
    excerpt:
      "Don't standardize HTML layouts across themes—standardize the CMS data contract and logical media_asset IDs so every domain can re-theme freely with zero hardcoded URLs.",
    coverImageRef: "media://cover-cms-platform",
    date: "October 14, 2026",
    year: "2026",
    readTime: "6 min read",
    category: "design",
    categoryLabel: "Platform Architecture",
    author: defaultAuthor,
    tags: ["CMS", "IAPJ", "Themes"],
    sections: [
      {
        paragraphs: [
          "To support many domains and custom themes (beautifultheme1, iasf, iapj) inside one CMS without locking every storefront into a single layout, separate your architecture into two layers: Platform Chrome and Merchant Theme Sections."
        ],
        table: {
          headers: ["Layer", "Who Uses It", "Layout Freedom", "How It Is Controlled"],
          rows: [
            [
              "1. Platform Shell (.ia-universal-footer)",
              "Core InnerAnimalMedia & AgentSam domains",
              "Standardized layout (CTA + Contact + 3 Link Groups)",
              "Skinned per domain via --footer-* CSS custom properties."
            ],
            [
              "2. Theme Footer Sections (iapj, iasf, etc.)",
              "Merchant stores & custom domain sites",
              "100% custom HTML/CSS layout per theme",
              "Driven by standardized footer.schema.json blocks and media IDs."
            ]
          ]
        }
      },
      {
        heading: "Standardized CMS Footer Schema & Asset Reference Rules",
        paragraphs: [
          "Themes must never bake raw CDN URLs or .glb filenames into JS bundles or TSX components. Every 3D scene, portrait, and cover image is declared via logical asset IDs resolved through the CMS media layer at runtime."
        ],
        code: {
          language: "json",
          label: "footer.schema.json (excerpt)",
          content: `{
  "section": "footer",
  "name": "Site Footer",
  "settings": [
    { "type": "color", "id": "bg", "label": "Background", "default": "#070709" },
    { "type": "color", "id": "accent", "label": "Accent", "default": "#7c5cff" },
    {
      "type": "media_asset",
      "id": "backdrop_glb",
      "label": "3D Scene (.glb)",
      "accept": ["model/gltf-binary"]
    }
  ]
}`
        },
        callout: {
          label: "The Zero-Hardcoded-URLs Standard",
          text: "All media and navigation targets flow through site.manifest.json and resolveMedia(mediaRef), supporting window.__IA_MEDIA_MAP__ runtime injection without editing theme code."
        }
      }
    ]
  }
];
