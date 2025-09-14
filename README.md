# Comit

## Overview
Comit is a powerful tool that automatically generates commit messages based on staged changes in a Git repository. 
It analyzes diffs to create structured and meaningful commit messages, helping maintain consistency in your commit history.  
Additional features include automatic branch name generation and an AI-powered chat assistant for coding-related queries.  
Simplify your Git workflow with Comit!

## Features
- Analyzes staged diff files to generate commit messages
- Provides structured and meaningful commit messages
- Helps maintain consistency in commit history
- Generate Branch Names
- Chat with an Agent

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm or yarn
- Git

### Global Installation
```bash
npm install -g jcomit
```

Or using yarn:
```bash
yarn global add jcomit
```

### Local Installation
```bash
npm install jcomit
```

Or using yarn:
```bash
yarn add jcomit
```

## Usage

### Generate Commit Messages
1. Stage your changes using `git add`
2. Run the command:
```bash
jcomit
```
3. Select the most appropriate commit message from the suggestions

### How It Works
Comit analyzes your staged changes and uses AI to generate meaningful commit messages that accurately describe your changes. It presents multiple options for you to choose from, ensuring that your commit history remains consistent and informative.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License - see the package.json file for details.

## Author
@issamoxix
