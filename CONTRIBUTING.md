# Contributing to SaloneVest

Thank you for your interest in contributing to SaloneVest! This document provides guidelines and instructions.

## Code of Conduct

Be respectful, inclusive, and constructive. We're building a community.

## Getting Started

### 1. Fork & Clone

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/saloneVest.git
cd saloneVest
\`\`\`

### 2. Create Branch

\`\`\`bash
# Feature branch
git checkout -b feature/amazing-feature

# Bug fix branch
git checkout -b fix/critical-bug

# Docs branch
git checkout -b docs/improvement
\`\`\`

### 3. Set Up Development

\`\`\`bash
npm install
npm run dev
# Visit http://localhost:3000
\`\`\`

## Development Workflow

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Format with Prettier

\`\`\`bash
npm run lint
npm run format
\`\`\`

### Component Guidelines

- Use shadcn/ui components
- Props should be typed
- Export components from `index.tsx`
- Add JSDoc comments

\`\`\`tsx
/**
 * Investment card component for displaying opportunities
 * @param investment - Investment data
 * @param onInvest - Callback when user clicks invest
 */
export function InvestmentCard({ investment, onInvest }: Props) {
  // ...
}
\`\`\`

### Testing

\`\`\`bash
npm run test
npm run test:watch
npm run test:coverage
\`\`\`

## Commit Guidelines

Follow conventional commits:

\`\`\`
feat: Add new investment type filtering
fix: Correct portfolio calculation bug
docs: Update deployment guide
style: Format investment card styles
refactor: Simplify wallet connection logic
perf: Optimize portfolio chart rendering
test: Add investment modal tests
chore: Update dependencies
\`\`\`

## Pull Request Process

### 1. Before Submitting

- [ ] Branch up to date with main
- [ ] All tests passing
- [ ] Code formatted and linted
- [ ] No console errors/warnings
- [ ] Commit messages follow guidelines

### 2. PR Description

\`\`\`markdown
## Description
Brief summary of changes

## Related Issues
Closes #123

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]
\`\`\`

### 3. Code Review

- Respond to feedback promptly
- Make requested changes in new commits
- Request re-review when ready

## Areas for Contribution

### High Priority
- [ ] Backend API implementation
- [ ] Database integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Performance optimization

### Medium Priority
- [ ] Additional investment types
- [ ] Enhanced error handling
- [ ] Unit test coverage
- [ ] Documentation improvements
- [ ] Accessibility features

### Good First Issues
- [ ] UI/UX improvements
- [ ] Documentation updates
- [ ] Bug fixes
- [ ] Component refinements
- [ ] Code cleanup

## Documentation

### Adding Docs

1. Create `.md` file in `/docs`
2. Update index if applicable
3. Add to navigation menu
4. Link from relevant pages

### Code Comments

- Explain WHY, not WHAT
- Use JSDoc for functions
- Keep comments up to date

## Questions?

- **Discord**: [Community Channel](https://discord.gg/saloneVest)
- **Discussions**: GitHub Discussions
- **Email**: dev@saloneVest.io

---

Thank you for contributing to SaloneVest!
