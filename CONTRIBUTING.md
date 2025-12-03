# Contributing to ShoreSquad

Thank you for your interest in contributing to ShoreSquad! We're excited to have you join our mission to make beach cleanups more accessible and fun. 🌊

## 🌍 Code of Conduct

We're committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- Git
- Basic knowledge of HTML, CSS, and JavaScript

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Visit: https://github.com/yourusername/shoresquad
   # Click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/shoresquad.git
   cd shoresquad
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/shoresquad.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open browser to `http://localhost:8080`

## 📋 How to Contribute

### 1. **Report Bugs**

Found a bug? Please create an issue with:
- **Title**: Clear, descriptive bug title
- **Description**: What happened vs. expected behavior
- **Steps to reproduce**: Specific steps to recreate
- **Screenshots**: Visual evidence if applicable
- **Environment**: Browser, OS, version

```markdown
### Bug Report
**Environment**: Chrome 120 on Windows 11

**Describe the bug**
Location search doesn't work when clicking the search button.

**Steps to reproduce**
1. Go to "Find Your Next Cleanup" section
2. Type "Santa Monica" in search bar
3. Click the location button (📍)
4. Error appears

**Expected behavior**
Should update map with Santa Monica location

**Screenshots**
[Attach screenshot]
```

### 2. **Suggest Features**

Have a great idea? Submit a feature request:
- **Clear title**: What would you add?
- **Use case**: Why do you need it?
- **Proposed solution**: How would you implement it?
- **Alternatives**: Other approaches considered

```markdown
### Feature Request
**Feature**: Offline event viewing

**Motivation**
Users at the beach might lose connection but still want to see their upcoming cleanup details.

**Proposed Implementation**
- Cache upcoming cleanup events in Service Worker
- Show cached events when offline
- Indicate which events are cached

**Additional Context**
Gen Z users expect offline-first experiences
```

### 3. **Submit Code Changes**

#### Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add comments for complex logic
   - Follow existing code style
   - Test in multiple browsers

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add crew member profiles

   - Add member card UI component
   - Integrate with crew data
   - Add profile picture upload
   - Update team section styles
   
   Closes #123"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Clear title and description
   - Reference related issues (#123)
   - Explain changes and why they matter
   - Add screenshots for UI changes

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic change)
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Test additions/updates
- `chore`: Build, dependencies, etc.

**Examples**:
```bash
git commit -m "feat(map): add geolocation button"
git commit -m "fix(weather): handle API errors gracefully"
git commit -m "docs: update installation instructions"
git commit -m "style: improve button hover states"
```

## 📐 Code Style Guide

### HTML
```html
<!-- Use semantic HTML5 elements -->
<section id="features">
  <h2>Our Features</h2>
  <button class="btn btn-primary" aria-label="Start cleanup">
    Start
  </button>
</section>

<!-- Indent properly, 2 spaces -->
<div class="container">
  <div class="card">
    <h3>Title</h3>
  </div>
</div>
```

### CSS
```css
/* Use CSS custom properties */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius);
  transition: var(--transition);
}

/* Mobile-first approach */
@media (min-width: 768px) {
  .button {
    padding: var(--spacing-lg);
  }
}

/* Group related properties */
.card {
  /* Layout */
  display: flex;
  gap: var(--spacing-md);
  
  /* Sizing */
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  
  /* Styling */
  background-color: white;
  box-shadow: var(--shadow-md);
}
```

### JavaScript
```javascript
/**
 * Descriptive function comment
 * @param {type} paramName - Description
 * @returns {type} Description
 */
function descriptiveName(paramName) {
    // Use meaningful variable names
    const result = processData(paramName);
    
    // Add comments for "why", not "what"
    // User location is stored to minimize API calls
    this.userLocation = result;
    
    return result;
}

// Use const by default, let when reassigning
const immutableValue = 'won\'t change';
let mutableValue = 0;
mutableValue += 1;

// Use arrow functions for callbacks
array.map(item => item.name);

// Use template literals
const message = `Hello, ${name}!`;

// Use meaningful names
const getUserLocation = () => { /* ... */ };
// NOT: const func = () => { /* ... */ };
```

## 🧪 Testing Guidelines

### Before Submitting PR

1. **Manual Testing**
   ```bash
   # Test on different screen sizes
   # Test on mobile (use Chrome DevTools)
   # Test keyboard navigation
   # Test screen reader (NVDA, JAWS, VoiceOver)
   ```

2. **Cross-browser Testing**
   - Chrome/Edge
   - Firefox
   - Safari
   - Mobile browsers

3. **Accessibility Checklist**
   - [ ] Proper heading hierarchy
   - [ ] ARIA labels where needed
   - [ ] Color contrast ≥ 4.5:1
   - [ ] Keyboard navigation works
   - [ ] Screen reader compatible

4. **Performance Checklist**
   - [ ] No console errors
   - [ ] Load time < 2s
   - [ ] Lighthouse score > 85

## 📚 Areas to Contribute

### High Priority
- 🗺️ Integrate Leaflet.js/Mapbox for real map
- 👥 Crew management system
- 🔐 User authentication
- 📱 Mobile PWA improvements
- ♿ Accessibility enhancements

### Good for Beginners
- 📝 Documentation improvements
- 🎨 UI/UX refinements
- 🐛 Bug fixes
- ♿ Accessibility improvements
- 🎯 Code comments

### Advanced
- 🔄 Backend API integration
- 🗄️ Database design
- ⚡ Performance optimization
- 🔐 Security hardening
- 📊 Analytics integration

## 🔍 PR Review Process

### What Reviewers Look For
1. **Code Quality**
   - Follows code style guide
   - No unnecessary complexity
   - Well-commented where needed
   - DRY principle followed

2. **Functionality**
   - Feature works as described
   - No regressions introduced
   - Edge cases handled
   - Error handling included

3. **Accessibility**
   - WCAG 2.1 AA compliant
   - No breaking accessibility changes
   - Proper ARIA labels

4. **Performance**
   - No performance regressions
   - Optimized for mobile
   - Efficient algorithms

### Tips for Getting PR Approved Faster
- Self-review your code first
- Keep PRs focused and small
- Write clear commit messages
- Reference related issues
- Respond promptly to feedback
- Test thoroughly

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [JavaScript Best Practices](https://javascript.info/)
- [Git Guide](https://git-scm.com/doc)
- [Leaflet.js Docs](https://leafletjs.com/)

## 💬 Communication

- **Issues**: General discussion, bug reports
- **Discussions**: Feature brainstorming
- **Email**: team@shoresquad.example.com
- **Slack**: [Join our community](link)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🙏

Your contributions help make ShoreSquad better for everyone. Together, we're making beaches cleaner and our community stronger. 🌊💚

**Questions?** Feel free to ask in Issues or create a Discussion!
