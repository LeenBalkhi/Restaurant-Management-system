# Restaurant Management System

A graduation project implementing a Restaurant Management System using TypeScript, Node.js, and TypeORM.

## Overview

This project is a backend application for managing restaurant operations, including order processing, menu management, and more. It leverages TypeScript and Node.js, with TypeORM for database interactions.

## Getting Started

### Prerequisites

* Node.js and npm installed
* A compatible database configured via `ormconfig.json`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/LeenBalkhi/Restaurant-Management-system.git
   cd Restaurant-Management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   ts-node-dev src/index.ts
   ```

4. Immediately stop the program (Ctrl + C) to prepare for migrations.

5. Run database migrations:

   ```bash
   npm run migration:run
   ```

6. Start the application again:

   ```bash
   ts-node-dev src/index.ts
   ```

The application will automatically reload upon saving changes to the code.

## Project Structure

* `src/` - Contains the TypeScript source code files
* `ormconfig.json` - Configuration file for TypeORM
* `package.json` - Project metadata and scripts
* `tsconfig.json` - TypeScript compiler configuration

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

