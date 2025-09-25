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

- Contributors paste or upload their research.
- An **LLM-powered pipeline** formats submissions into a validated JSON schema.
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
- 🤖 **Automated structuring** — LLM ensures consistent schema.
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
  "title": "Tenant Payment Behaviour — Nairobi",
  "summary": "Survey of 150 property managers in Nairobi",
  "published_date": "2025-09-01",
  "market": {
    "countries": ["Kenya"],
    "cities": ["Nairobi"]
  },
  "target_audience": ["property_manager"],
  "contributors": [
    {
      "name": "Jane Doe",
      "profile_url": "https://example.com/jane"
    }
  ],
  "methodology": {
    "type": "survey",
    "sample_size": 150,
    "collection_start": "2025-08-01",
    "collection_end": "2025-08-07"
  },
  "top_findings": [
    "62% report late payments are seasonal",
    "48% prefer M-Pesa only",
    "Most managers have no automated reminders"
  ],
  "insights": [
    "Late payments linked to seasonal cash-flow gaps",
    "Strong demand for M-Pesa-only platforms"
  ],
  "links": {
    "raw_data": "https://drive.example.com/raw.csv",
    "report": "https://drive.example.com/report.pdf",
    "landing_page": "https://project.example.com"
  },
  "license": "CC-BY-4.0",
  "tags": ["tenant-payments", "mpesa", "real-estate"],
  "verification_status": "pending",
  "created_at": "2025-09-01T12:00:00Z",
  "updated_at": "2025-09-01T12:00:00Z"
}
```

## 🚀 Getting Started

### Clone the repo

```bash
git clone https://github.com/farajabien/open-market-research.git
cd open-market-research
```

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

## 📝 How to Contribute

1. **Fork** this repo.
2. Add a new research study:

   - Either via the **submission form** (UI).
   - Or by creating a new JSON file under `/studies/`.

3. Run validation (`npm run validate`) to check schema compliance.
4. Submit a **pull request**.

✅ Your study will be reviewed, verified, and merged into the repository.

## 🔒 Ethics & Licensing

- All contributions must be **de-identified** (no personal data).
- Contributors confirm consent was collected from participants.
- Default license: **CC-BY-4.0** (others may reuse with attribution).
- Takedown process: [OPEN takedown policy here].

## 🛠 Tech Stack

- **Frontend:** Next.js + TailwindCSS + Shadcn UI
- **Database:** InstantDB
- **Automation:** GitHub Actions + JSON Schema validation
- **LLM Processing:** provider-agnostic
- **Deployment:** Vercel

## 📈 Roadmap

- [ ] Submission form → JSON structuring (MVP)
- [ ] Public index + search & filter
- [ ] Contributor profiles
- [ ] Moderation & verification workflow
- [ ] Export & API access
- [ ] Launch campaign with 10+ seed studies

## 🤝 Community (Soon)

- Join the [Discord/Slack link here] to discuss and contribute.
- Follow updates on [Twitter/LinkedIn link here].

## 📜 License

This project is licensed under [MIT](LICENSE).
Research contributions are published under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

## 🙌 Acknowledgments

Inspired by countless founders re-doing the same research. Built for the startup community, by the startup community.
