# Unifi Late In Exception Management System - Angular

A modern, modular Angular application for managing employee late arrival exceptions with Unifi branding.

## Architecture

### Project Structure
```
src/app/
├── core/                    # Singleton services, models, guards
│   ├── models/             # TypeScript interfaces and types
│   ├── services/           # Business logic services
│   ├── guards/             # Route guards
│   └── interceptors/       # HTTP interceptors
├── shared/                  # Reusable components, directives, pipes
│   ├── components/         # Shared UI components
│   ├── directives/         # Custom directives
│   └── pipes/              # Custom pipes
├── features/                # Feature modules
│   ├── login/              # Login feature
│   └── late-in-management/ # Late In management feature
│       ├── components/     # Feature-specific components
│       └── services/       # Feature-specific services
└── styles/                  # Global styles and themes
```

### Key Features

- **Modular Architecture**: Clean separation of concerns with core, shared, and feature modules
- **TypeScript**: Strongly typed with interfaces and models
- **Reactive Programming**: RxJS observables for state management
- **Material Design**: Angular Material for grid and UI components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Unifi Branding**: Custom theme with Unifi colors

### Technologies

- **Angular 17**: Latest Angular framework
- **TypeScript 5.2**: Strong typing and modern JavaScript features
- **Angular Material**: Material Design components and grid
- **RxJS 7**: Reactive programming with observables
- **SCSS**: Modular styling with variables

## Getting Started

### Prerequisites

- Node.js >= 18.19
- npm >= 9.0

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Features

### Grid Features
- **Pagination**: 50 rows/page (configurable: 25/50/100)
- **Sorting**: Click column headers to sort
- **Filtering**: Multiple filter options
- **Bulk Actions**: Update multiple records at once
- **Validation**: Real-time validation with error highlighting

### User Roles
- **Site Manager (SM)**: Full edit access
- **Area Manager (AMH)**: Full edit + AMH fields
- **Operations (Ops)**: Read-only access
- **Admin**: Read-only access

### Data Columns
- Employee ID (alphanumeric)
- Schedule In/Out (24-hour format)
- Clocked In/Out (24-hour format)
- Excused (Y/N) - Mandatory
- Comment (500 char limit) - Mandatory for Late In
- Kronos Status

## Code Style

- **Human-readable**: Clear variable names and comments
- **Modular**: Single responsibility principle
- **Type-safe**: Full TypeScript typing
- **Reactive**: Observable-based state management
- **Testable**: Services and components designed for testing

## License

Proprietary - iLink Systems Inc.
