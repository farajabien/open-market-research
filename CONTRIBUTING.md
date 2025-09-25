# Contributing to Open Market Research

Thank you for your interest in contributing to Open Market Research! This guide will help you get started with contributing to our open-source platform for structured market research.

## 🌟 How to Contribute

### 1. **Submit Research Studies**

The easiest way to contribute is by sharing your market research:

- **Via Email**: Send your research to [hello@fbien.com](mailto:hello@fbien.com)
- **Via GitHub**: Create a pull request with your study data
- **Via Form**: Use our submission form (coming soon)

### 2. **Code Contributions**

Help us build and improve the platform:

- **Bug Fixes**: Report and fix issues
- **Features**: Add new functionality
- **UI/UX**: Improve the user experience
- **Documentation**: Help others understand the project

### 3. **Community Building**

Help grow the community:

- **Share**: Tell other founders about the platform
- **Feedback**: Provide suggestions and feedback
- **Testing**: Help test new features
- **Content**: Write tutorials or guides

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (preferred) or npm
- Git

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/open-market-research.git
   cd open-market-research
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

```
open-market-research/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── studies/           # Studies library
│   ├── submit/            # Submission form
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── sections/          # Page sections
│   └── ui/               # UI components (shadcn)
├── lib/                  # Utility functions
├── public/               # Static assets
└── README.md
```

## 📝 Research Study Format

### JSON Schema

All studies must follow our standardized JSON schema:

```json
{
  "id": "uuid-001",
  "title": "Study Title — Location",
  "summary": "Brief description of the study",
  "published_date": "2025-01-01",
  "market": {
    "countries": ["Country"],
    "cities": ["City"]
  },
  "target_audience": ["audience_type"],
  "contributors": [
    {
      "name": "Your Name",
      "profile_url": "https://your-site.com"
    }
  ],
  "methodology": {
    "type": "survey|interview|focus_group",
    "sample_size": 100,
    "collection_start": "2025-01-01",
    "collection_end": "2025-01-15"
  },
  "top_findings": ["Key finding 1", "Key finding 2"],
  "insights": ["Insight 1", "Insight 2"],
  "links": {
    "raw_data": "https://link-to-data.com",
    "report": "https://link-to-report.com",
    "landing_page": "https://your-project.com"
  },
  "license": "CC-BY-4.0",
  "tags": ["tag1", "tag2"],
  "verification_status": "pending|verified|rejected"
}
```

### Study Guidelines

1. **Quality Standards**

   - Studies must be based on real research
   - Data must be de-identified (no personal information)
   - Findings must be factual and evidence-based
   - Include proper attribution and consent

2. **Required Information**

   - Clear title with location
   - Methodology details
   - Sample size and collection period
   - Key findings and insights
   - Proper licensing (CC-BY-4.0 default)

3. **Optional Information**
   - Raw data links
   - Detailed reports
   - Project landing pages
   - Additional tags

## 🛠 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow Next.js 15+ conventions
- Use Tailwind CSS for styling
- Follow the existing component patterns

### Component Guidelines

- Use shadcn/ui components when possible
- Create reusable, well-documented components
- Follow the established naming conventions
- Include proper TypeScript types

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test your changes: `pnpm build`
4. Commit with clear messages
5. Push to your fork
6. Create a pull request

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Reference to any related issues

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Feature Requests

For new features, please include:

- Clear description of the feature
- Use case and benefits
- Mockups or examples if possible
- Any implementation ideas

## 📋 Study Review Process

### Submission Review

1. **Initial Review**: Basic format and content check
2. **Quality Check**: Verify research methodology
3. **Verification**: Confirm findings are accurate
4. **Approval**: Study is published to the library

### Review Criteria

- ✅ Follows JSON schema
- ✅ Contains real research data
- ✅ Properly de-identified
- ✅ Clear methodology
- ✅ Actionable insights
- ✅ Proper attribution

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Respect different perspectives
- Follow the golden rule

### Communication

- Use clear, concise language
- Be patient with newcomers
- Ask questions when unsure
- Share knowledge freely
- Celebrate contributions

## 🎯 Roadmap & Priorities

### Current Priorities

- [ ] Submission form with AI structuring
- [ ] Studies library with search/filter
- [ ] Contributor profiles
- [ ] Moderation workflow
- [ ] Export functionality

### How to Help

- **Frontend**: React/Next.js components
- **Backend**: API development
- **AI/ML**: Research structuring pipeline
- **Design**: UI/UX improvements
- **Content**: Documentation and guides

## 📞 Getting Help

### Questions?

- **GitHub Issues**: For bugs and feature requests
- **Email**: [hello@fbien.com](mailto:hello@fbien.com) for general questions
- **Discussions**: Use GitHub Discussions for community chat

### Resources

- [Project README](./README.md)
- [Live Site](https://open-market-research.vercel.app/)
- [GitHub Repository](https://github.com/farajabien/open-market-research)

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Project README
- Release notes
- Community highlights

Thank you for helping make market research more accessible and collaborative!

---

**Happy Contributing! 🚀**
