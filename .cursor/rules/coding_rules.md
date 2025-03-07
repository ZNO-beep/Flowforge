# FlowForge Coding Rules

## React Flow Implementation Guidelines

### 1. Organizational Structure

#### Node Components
- Use the `OrgStructureNode` component for all department, role, and function nodes
- Follow the established type system: 'department', 'role', 'function'
- Maintain consistent styling based on node type
- Implement expansion/collapse functionality using the provided patterns

```jsx
// Example node data structure
const departmentNode = {
  id: 'dept-1',
  type: 'department',
  label: 'Sales',
  expanded: true,
  hasChildren: true,
  onToggle: () => handleToggle('dept-1'),
  onAdd: () => handleAdd('dept-1')
};
```

#### Flow Management
- Use the `OrgStructureFlow` component for organizational chart visualization
- Maintain hierarchical relationships between nodes
- Implement consistent layout algorithms (dagre for hierarchical layouts)
- Handle node expansion/collapse through state management
- Persist expanded/collapsed state between sessions

```jsx
// Example node expansion handler
const handleToggle = (nodeId) => {
  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            expanded: !node.data.expanded
          }
        };
      }
      return node;
    })
  );
  
  // Update visible nodes based on expansion state
  updateVisibleNodes();
};
```

#### Data Structure
- Follow the `OrgNode` interface for all organizational structure data
- Maintain parent-child relationships through IDs
- Use the expanded flag to control visibility
- Store metadata as needed for additional functionality

### 2. Workflow Builder

#### Node Components
- Use specialized node components for different workflow steps
- Maintain consistent styling with the organizational structure
- Implement proper handle positioning for connections
- Use the same expansion/collapse pattern where applicable

#### Edge Components
- Use custom edges with appropriate styling
- Implement validation for connections
- Provide visual feedback for valid/invalid connections

### 3. Shared Patterns

#### State Management
- Use React Flow's built-in hooks for state management
- Implement consistent patterns for node/edge updates
- Maintain separation between organizational and workflow data
- Use context providers for shared state when appropriate

#### Styling
- Use Tailwind CSS for styling all React Flow components
- Follow the established color scheme for different node types
- Maintain consistent sizing and spacing
- Implement responsive design considerations

#### Performance
- Implement virtualization for large graphs
- Use memoization for custom node components
- Optimize edge rendering for complex flows
- Implement lazy loading where appropriate

## General Coding Guidelines

### 1. Component Structure
- Use functional components with hooks
- Implement proper prop validation
- Use memo for performance optimization
- Maintain clear separation of concerns

### 2. State Management
- Use appropriate state management based on scope
- Implement consistent patterns for updates
- Avoid direct mutation of state
- Use callbacks for state updates

### 3. Styling
- Use Tailwind CSS for all styling
- Follow the established design system
- Implement responsive design
- Use the utility-first approach

### 4. Testing
- Write tests for all custom components
- Test node/edge interactions
- Validate expansion/collapse functionality
- Test data persistence

## Core Code Principles

1. **Front-end focuses on presentation, not logic**  
     
   - The primary role is displaying data and collecting user input  
   - Complex business logic typically belongs on the back-end

   

2. **Code that's easy to read and understand**  
     
   - Simple code with clear intent tends to be better than clever code  
   - Code is read more often than it's written  
   - Readability leads to easier maintenance and collaboration

## Code Structure and Organization

### Size Limits (Visually Manageable Code)

- Files should not exceed 500 lines  
- Classes should not exceed 200 lines  
- Functions should not exceed 15 lines  
- Keep components small and focused

### Nesting and Indentation

- Consider using only one level of indentation within a function when possible  
    
- Avoiding nested if statements can improve readability:  
    
  // HARDER TO READ:  
    
  if (condition1) {  
    
    if (condition2) {  
    
      doSomething();  
    
    }  
    
  }  
    
  // EASIER TO READ:  
    
  if (\!condition1) return;  
    
  if (\!condition2) return;  
    
  doSomething();  
    
- It's helpful to avoid deeply nested loops and conditions  
    
- When encountering many levels of nesting, breaking the code into smaller functions often helps

### Avoiding Else Statements

- Using explicit conditions instead of else/catch-all blocks makes code more readable  
- Consider early returns instead of else blocks:  
    
  // LESS EXPLICIT:  
    
  if (isValid) {  
    
    processData();  
    
  } else {  
    
    showError();  
    
  }  
    
  // MORE EXPLICIT:  
    
  if (\!isValid) {  
    
    showError();  
    
    return;  
    
  }  
    
  processData();  
    
- Each branch of code should have clear, explicit conditions to improve understanding

### Single Responsibility

- Each function should do exactly ONE thing  
- Test: Can you describe what your function does without using "and"?  
  - If you say "this function validates the form AND submits the data" \- split it into two functions

### Function Naming

- Name functions clearly to describe what they do  
- Use verb-noun format (e.g., `displayUserData()`, `validateForm()`)  
- Function names should make their purpose obvious

## Front-End Specific Guidelines

### Component Structure (React)

- Breaking UI into small, reusable components can enhance maintainability  
- Each component works best with one clear purpose  
- Components function well when independent when possible  
- Consider separating concerns within React components:  
  - Separate configuration from component code  
  - Separate structure (JSX/TSX) from logic when feasible  
  - Try to keep HTML-like markup separate from components and hooks  
  - Import and compose components rather than defining everything in one file

// MIXED CONCERNS:

function UserProfile({ userId }) {

  const \[user, setUser\] \= useState(null);

  const \[loading, setLoading\] \= useState(true);

  

  useEffect(() \=\> {

    fetch(\`/api/users/${userId}\`)

      .then(res \=\> res.json())

      .then(data \=\> {

        setUser(data);

        setLoading(false);

      });

  }, \[userId\]);

  

  if (loading) {

    return \<div className="spinner"\>Loading...\</div\>;

  }

  

  return (

    \<div className="user-profile"\>

      \<h2\>{user.name}\</h2\>

      \<div className="user-details"\>

        \<p\>Email: {user.email}\</p\>

        \<p\>Role: {user.role}\</p\>

      \</div\>

      {user.isAdmin && \<AdminControls userId={userId} /\>}

    \</div\>

  );

}

// BETTER SEPARATION:

// UserProfileView.jsx \- Just the presentation

function UserProfileView({ user, loading }) {

  if (loading) {

    return \<LoadingSpinner /\>;

  }

  

  return (

    \<div className="user-profile"\>

      \<h2\>{user.name}\</h2\>

      \<div className="user-details"\>

        \<p\>Email: {user.email}\</p\>

        \<p\>Role: {user.role}\</p\>

      \</div\>

      {user.isAdmin && \<AdminControls userId={user.id} /\>}

    \</div\>

  );

}

// useUserData.js \- Custom hook for data fetching logic

function useUserData(userId) {

  const \[user, setUser\] \= useState(null);

  const \[loading, setLoading\] \= useState(true);

  

  useEffect(() \=\> {

    fetch(\`/api/users/${userId}\`)

      .then(res \=\> res.json())

      .then(data \=\> {

        setUser(data);

        setLoading(false);

      });

  }, \[userId\]);

  

  return { user, loading };

}

// UserProfile.jsx \- Combines the view and logic

function UserProfile({ userId }) {

  const { user, loading } \= useUserData(userId);

  return \<UserProfileView user={user} loading={loading} /\>;

}

### State Management

- Only use classes when state needs to be persisted  
- Prefer functional components with hooks (React) or equivalent  
- Keep state management simple and localized

### API Communication

1. Identify what data you need from the back-end  
2. Ask the back-end developer to provide appropriate endpoints  
3. Use these endpoints to fetch and send data  
4. Focus on proper error handling and loading states

### Form Handling

- Validate user input on the front-end for immediate feedback  
- But ALWAYS validate again on the back-end (never trust client-side validation alone)  
- Keep form submission logic simple

## Code Quality Tips

### Cyclomatic Complexity

- Avoid chains of function calls (A calls B calls C calls D)  
- Instead, call functions at the same level and pass results between them:  
    
  // AVOID:  
    
  function processData() {  
    
    const data \= fetchData();  // fetchData calls another function internally  
    
    // and so on...  
    
  }  
    
  // BETTER:  
    
  function processAll() {  
    
    const data \= fetchData();  
    
    const processed \= processData(data);  
    
    displayResult(processed);  
    
  }

### Meaningful Names and Documentation

- Choose clear, descriptive names for variables, functions, and classes  
- If you need comments to explain what your code is doing, your variable and function names likely aren't descriptive enough  
- Well-named code elements should make the code read almost like natural language  
- Comment WHY you did something, not WHAT you did  
- Code should be self-explanatory; if it needs extensive comments to understand, consider rewriting it

### Avoid Abbreviations

- Use complete words instead of abbreviations  
- Code will eventually be managed by AI/LLMs which may not understand domain-specific abbreviations  
- Clear, full names improve readability for everyone:  
    
  // UNCLEAR:  
    
  const usrDta \= fetchDta(uid);  
    
  calcTtl(usrDta);  
    
  updtUI();  
    
  // CLEAR:  
    
  const userData \= fetchUserData(userId);  
    
  calculateTotal(userData);  
    
  updateUserInterface();  
    
- Even commonly understood abbreviations can be ambiguous (e.g., "acc" could mean account or accumulator)

## Practical Example

// BAD EXAMPLE \- too much nesting, multiple responsibilities

function handleFormSubmit(event) {

  event.preventDefault();

  const username \= document.getElementById('username').value;

  const password \= document.getElementById('password').value;

  

  if (username && password) {

    if (username.length \>= 4\) {

      if (password.length \>= 8\) {

        fetch('/api/login', {

          method: 'POST',

          body: JSON.stringify({ username, password }),

          headers: { 'Content-Type': 'application/json' }

        })

        .then(response \=\> {

          if (response.ok) {

            response.json().then(data \=\> {

              localStorage.setItem('token', data.token);

              showDashboard(data.user);

            });

          } else {

            showError('Login failed');

          }

        })

        .catch(error \=\> {

          showError('Network error');

        });

      } else {

        showError('Password too short');

      }

    } else {

      showError('Username too short');

    }

  } else {

    showError('Please fill all fields');

  }

}

// GOOD EXAMPLE \- single responsibilities, minimal nesting

function validateForm(username, password) {

  if (\!username || \!password) return 'Please fill all fields';

  if (username.length \< 4\) return 'Username too short';

  if (password.length \< 8\) return 'Password too short';

  return null; // No error

}

function handleFormSubmit(event) {

  event.preventDefault();

  

  const username \= document.getElementById('username').value;

  const password \= document.getElementById('password').value;

  

  const error \= validateForm(username, password);

  if (error) {

    showError(error);

    return;

  }

  

  submitLoginRequest(username, password);

}

function submitLoginRequest(username, password) {

  fetch('/api/login', {

    method: 'POST',

    body: JSON.stringify({ username, password }),

    headers: { 'Content-Type': 'application/json' }

  })

  .then(handleLoginResponse)

  .catch(() \=\> showError('Network error'));

}

function handleLoginResponse(response) {

  if (\!response.ok) {

    showError('Login failed');

    return;

  }

  

  response.json().then(data \=\> {

    localStorage.setItem('token', data.token);

    showDashboard(data.user);

  });

}

## Code Quality Tools

### Using Linters and Static Analysis

- Linters can automatically catch many common issues before code review  
    
- Consider setting up ESLint/TSLint with appropriate rules to enforce:  
    
  - Cyclomatic complexity limits  
  - File size restrictions  
  - Class and function length  
  - Line length constraints  
  - Nesting depth  
  - Naming conventions  
  - Unused variables and imports


- Modern IDEs integrate linting directly, providing real-time feedback  
    
- Example ESLint rules that support these guidelines:  
    
  {  
    
    "rules": {  
    
      "max-len": \["error", { "code": 100 }\],  
    
      "max-lines": \["error", { "max": 500 }\],  
    
      "max-lines-per-function": \["error", { "max": 15 }\],  
    
      "complexity": \["error", { "max": 5 }\],  
    
      "max-depth": \["error", { "max": 2 }\],  
    
      "max-nested-callbacks": \["error", { "max": 2 }\]  
    
    }  
    
  }  
    
- Setting up pre-commit hooks to run linters automatically helps catch issues early  
    
- The goal of linters isn't to be pedantic but to provide guardrails that encourage good practices

## Summary Checklist

Before submitting code for review, consider asking:

- [ ] Are my files, classes, and functions small and focused?  
- [ ] Have I minimized nesting and indentation?  
- [ ] Does each function do exactly one thing?  
- [ ] Is the front-end focusing on presentation, not complex logic?  
- [ ] Are my variable and function names clear and descriptive?  
- [ ] Have I avoided deep chains of function calls?  
- [ ] Is my code easy to read and understand?

Remember: The goal is to write code that needs minimal revisions because it's clean, simple, and follows good practices from the start. Code that follows these principles is also:

- Easier to test  
- Easier to debug when issues arise  
- Easier to extend with new features  
- Easier to maintain over time  
- Easier to refactor when requirements change  
- Easier to share components between projects  
- Easier for new team members to understand


