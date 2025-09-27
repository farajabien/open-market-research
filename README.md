# Open Market Research

**Open Market Research** is a free, open-source platform where founders, researchers, and accelerators publish structured market research (surveys, interview notes, reports) so anyone building in a market can start from validated evidence — not guesswork.

## 🌍 Vision

Everyone building products should start from evidence.  
We make high-quality, attribution-respecting market research discoverable, reusable, and versioned — for free.

## 🚨 Problem

- Founders repeatedly re-run the same user research because prior studies are hard to find or hidden behind paywalls.
- Small teams lack time and budget to conduct large studies, forcing them to guess.
- Existing research is fragmented across PDFs, slides, and private docs with no standard structure.

## 💡 Solution

A public, structured repository of market research studies:

- Contributors paste their raw research data (interviews, surveys, notes).
- Our **AI-powered structuring** automatically formats submissions into validated JSON.
- Studies are searchable, filterable, and downloadable (JSON/CSV/PDF).
- Founders get contributor profiles and can link studies to their projects.
- Everything is **free, open-source, and versioned in Git**.

## 👥 Target Users

- Early-stage founders & product managers.
- University researchers & students.
- Accelerators & incubators.
- Investors & consultants.

## ✨ Features

- 📥 **Simple submissions** — paste raw research, get structured JSON.
- 🤖 **AI-powered structuring** — GitHub Models automatically formats your data.
- 🔍 **Search & filter** — by country, city, role, tags.
- 👤 **Contributor profiles** — get attribution and link to your project.
- ✅ **Moderation & verification** — quality maintained via human checks.
- 📤 **Download/export** — JSON, CSV, or PDF.
- 🔄 **Versioned** — all changes tracked in Git.

## 📂 Data Model (JSON Schema)

Every study is stored as a JSON object in InstantDB and versioned in Git.

```json
{
  "id": "uuid-001",
  "title": "Real Estate Agent Challenges — Nairobi",
  "summary": "Interview study of 20+ real estate agents in Nairobi",
  "published_date": "2025-09-01",
  "market": {
    "countries": ["Kenya"],
    "cities": ["Nairobi"]
  },
  "target_audience": ["real_estate_agent"],
  "contributors": [
    {
      "name": "Jane Doe",
      "profile_url": "https://example.com/jane"
    }
  ],
  "methodology": {
    "type": "interview",
    "sample_size": 20,
    "collection_start": "2025-01-01",
    "collection_end": "2025-01-15"
  },
  "top_findings": [
    "Getting access to fresh vacant units is the #1 challenge",
    "Content creation is extremely time-consuming for part-time agents",
    "Fast-moving rental market creates inventory scarcity"
  ],
  "insights": [
    "Agents compete for limited inventory due to real-time vacancy updates",
    "Part-time agents struggle with multi-platform content creation workflow",
    "Fresh unit access directly impacts agent success and revenue"
  ],
  "links": {
    "raw_data": "https://drive.example.com/raw.csv",
    "report": "https://drive.example.com/report.pdf",
    "landing_page": "https://project.example.com",
    "presentation": "https://slides.example.com/presentation.pdf"
  },
  "license": "CC-BY-4.0",
  "tags": [
    "real-estate",
    "content-creation",
    "inventory-access",
    "part-time-agents"
  ],
  "verification_status": "pending",
  "created_at": "2025-09-01T12:00:00Z",
  "updated_at": "2025-09-01T12:00:00Z"
}
```

## 🌐 Live Site

**Visit the live application**: [https://open-market-research.vercel.app/](https://open-market-research.vercel.app/)

## 🚀 Getting Started

### Clone the repo

```bash
git clone https://github.com/farajabien/open-market-research.git
cd open-market-research
```

### Install dependencies

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 How to Contribute

We welcome contributions! Here are the main ways to contribute:

### 🧪 Submit Research Studies

- **Email**: Send your research to [hello@fbien.com](mailto:hello@fbien.com)
- **GitHub**: Create a pull request with your study data
- **Form**: Use our submission form (coming soon)

### 💻 Code Contributions

- **Bug Fixes**: Report and fix issues
- **Features**: Add new functionality
- **UI/UX**: Improve the user experience
- **Documentation**: Help others understand the project

### 🤝 Community Building

- **Share**: Tell other founders about the platform
- **Feedback**: Provide suggestions and feedback
- **Testing**: Help test new features

**📖 For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)**

## 🔒 Ethics & Licensing

- All contributions must be **de-identified** (no personal data).
- Contributors confirm consent was collected from participants.
- Default license: **CC-BY-4.0** (others may reuse with attribution).
- Takedown process: [OPEN takedown policy here].

## 🛠 Tech Stack

- **Frontend:** Next.js + TailwindCSS + Shadcn UI
- **Database:** InstantDB
- **Automation:** GitHub Actions + JSON Schema validation
- **LLM Processing:** GitHub Models API
- **Deployment:** Vercel

## 📈 Roadmap

- [x] Submission form → JSON structuring (MVP)
- [x] Public index + search & filter
- [x] Contributor profiles
- [ ] Moderation & verification workflow
- [ ] Export & API access
- [ ] Launch campaign with 10+ seed studies

## 🤝 Community

- **Website**: [https://open-market-research.vercel.app/](https://open-market-research.vercel.app/)
- **GitHub**: [https://github.com/farajabien/open-market-research](https://github.com/farajabien/open-market-research)
- **Email**: [hello@fbien.com](mailto:hello@fbien.com)
- **Personal Site**: [fbien.com](https://fbien.com)

## 📜 License

This project is licensed under [MIT](LICENSE).
Research contributions are published under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

## 🙌 Acknowledgments

Inspired by countless founders re-doing the same research. Built for the startup community, by the startup community.
