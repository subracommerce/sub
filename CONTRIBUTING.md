# Contributing to SUBRA

Thank you for your interest in contributing to SUBRA! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/subra/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Open a new issue with the `enhancement` label
2. Clearly describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Why it would benefit SUBRA users
   - Any alternative solutions you considered

### Pull Requests

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/subra.git`
3. **Create a branch**: `git checkout -b feature/my-feature`
4. **Make your changes** following our coding standards
5. **Test** your changes thoroughly
6. **Commit** with clear messages: `git commit -m "feat: add amazing feature"`
7. **Push** to your fork: `git push origin feature/my-feature`
8. **Open a Pull Request** with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots/videos if UI changes

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for exported functions
- Keep functions small and focused

```typescript
/**
 * Calculate the total amount including fees
 * @param amount - The base amount
 * @param feePercent - Fee percentage (0-100)
 * @returns Total amount with fees
 */
export function calculateTotal(amount: number, feePercent: number): number {
  return amount * (1 + feePercent / 100);
}
```

### React/Next.js

- Use functional components with hooks
- Implement proper error boundaries
- Use Server Components where possible
- Follow accessibility best practices
- Keep components focused and reusable

### Solidity

- Follow OpenZeppelin patterns
- Include comprehensive NatSpec comments
- Write tests for all public functions
- Use events for important state changes
- Implement proper access controls

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add agent reputation system
fix: resolve race condition in task queue
docs: update API documentation
test: add unit tests for crypto utils
```

## 🧪 Testing Requirements

### Before Submitting PR

- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Code is linted (`pnpm lint`)
- [ ] Types are correct (`pnpm build`)
- [ ] Changes are documented

### Running Tests

```bash
# All tests
pnpm test

# Specific package
cd apps/api && pnpm test

# Smart contracts
cd apps/contracts && forge test

# With coverage
forge test --coverage
```

## 📦 Project Structure

```
SUBRA/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Fastify backend
│   ├── agents/       # AI agent runtime
│   ├── contracts/    # Smart contracts
│   └── circuits/     # ZK circuits
├── packages/
│   ├── config/       # Shared config
│   ├── utils/        # Utilities
│   ├── sdk/          # TypeScript SDK
│   └── ui/           # UI components
└── docs/             # Documentation
```

## 🔍 Code Review Process

1. Maintainers will review your PR within 48 hours
2. Address any requested changes
3. Once approved, a maintainer will merge
4. Your contribution will be credited in release notes

## 🎯 Areas We Need Help

- [ ] Mobile app development (React Native)
- [ ] Additional AI agent types
- [ ] More blockchain integrations
- [ ] Documentation and tutorials
- [ ] UI/UX improvements
- [ ] Performance optimizations
- [ ] Test coverage
- [ ] Internationalization

## 💬 Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Discord**: Real-time chat and community
- **Twitter**: Updates and announcements

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior:**
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

**Unacceptable behavior:**
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

### Enforcement

Violations may result in temporary or permanent ban from the project.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be:
- Listed in release notes
- Added to CONTRIBUTORS.md
- Credited in documentation
- Featured on our website (for significant contributions)

## ❓ Questions?

Feel free to ask in:
- GitHub Discussions
- Discord server
- Email: dev@subra.app

Thank you for contributing to SUBRA! 🚀

