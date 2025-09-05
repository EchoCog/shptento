# Architecture Overview

This document provides a high-level overview of the Tento Shopify data framework architecture.

## System Overview

Tento is a TypeScript framework that provides type-safe interactions with Shopify's metaobject system through a client library and CLI tool.

```mermaid
graph TB
    subgraph "Developer Environment"
        Dev[Developer]
        Schema[schema.ts]
        Config[tento.config.ts]
        CLI[Tento CLI]
    end

    subgraph "Tento Framework"
        Client[Tento Client]
        Validation[Field Validation]
        GQLGen[GraphQL Codegen]
        Types[Generated Types]
    end

    subgraph "Shopify Platform"
        AdminAPI[Admin GraphQL API]
        Metaobjects[Metaobjects Store]
        Metafields[Metafields Store]
    end

    Dev -->|defines| Schema
    Dev -->|configures| Config
    Dev -->|runs commands| CLI
    
    CLI -->|reads| Schema
    CLI -->|reads| Config
    CLI -->|interacts with| Client
    
    Client -->|validates through| Validation
    Client -->|uses| Types
    Client -->|queries| AdminAPI
    
    GQLGen -->|generates| Types
    GQLGen -->|from| AdminAPI
    
    AdminAPI -->|manages| Metaobjects
    AdminAPI -->|manages| Metafields
    
    Validation -->|enforces| Schema
    
    style Dev fill:#ff9
    style Schema fill:#e1e
    style Config fill:#e1e
    style CLI fill:#9cf
    style Client fill:#9cf
    style Validation fill:#9cf
    style GQLGen fill:#9cf
    style Types fill:#e1e
    style AdminAPI fill:#9f9
    style Metaobjects fill:#9f9
    style Metafields fill:#9f9
```

## Core Components

### 1. Client Library (`src/client/`)

The type-safe client for interacting with Shopify metaobjects:

```mermaid
graph LR
    subgraph "Client Components"
        MetaObj[Metaobject Manager]
        Field[Field System]
        Query[Query Builder]
        GQLClient[GraphQL Client]
        ApplySchema[Schema Applicator]
        Diff[Schema Differ]
    end

    MetaObj --> Field
    MetaObj --> Query
    Query --> GQLClient
    ApplySchema --> Diff
    ApplySchema --> GQLClient
    Field --> Validation[Field Validation]
    
    style MetaObj fill:#9cf
    style Field fill:#9cf
    style Query fill:#9cf
    style GQLClient fill:#9cf
    style ApplySchema fill:#9cf
    style Diff fill:#9cf
    style Validation fill:#ff9
```

### 2. CLI Tool (`src/cli/`)

Command-line interface for schema management:

```mermaid
graph TD
    CLI[CLI Entry Point]
    Commands{Command Type}
    Pull[Pull Command]
    Push[Push Command]
    Config[Config Reader]
    Schema[Schema Reader]
    
    CLI --> Commands
    Commands -->|pull| Pull
    Commands -->|push| Push
    
    Pull --> Config
    Pull --> Schema
    Push --> Config
    Push --> Schema
    
    Config -->|reads| ConfigFile[tento.config.ts]
    Schema -->|reads| SchemaFile[schema.ts]
    
    style CLI fill:#9cf
    style Pull fill:#9cf
    style Push fill:#9cf
    style Config fill:#9cf
    style Schema fill:#9cf
    style ConfigFile fill:#e1e
    style SchemaFile fill:#e1e
```

### 3. GraphQL Layer (`src/graphql/`)

Auto-generated GraphQL types and operations:

```mermaid
graph TB
    CodeGen[GraphQL Codegen]
    ShopifySchema[Shopify Admin API Schema]
    Operations[GraphQL Operations]
    Types[Generated Types]
    
    CodeGen -->|fetches| ShopifySchema
    CodeGen -->|processes| Operations
    CodeGen -->|generates| Types
    
    Operations -->|defines| Queries[Queries]
    Operations -->|defines| Mutations[Mutations]
    Operations -->|defines| Fragments[Fragments]
    
    style CodeGen fill:#9cf
    style ShopifySchema fill:#9f9
    style Operations fill:#e1e
    style Types fill:#e1e
    style Queries fill:#ff9
    style Mutations fill:#ff9
    style Fragments fill:#ff9
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CLI as Tento CLI
    participant Client as Tento Client
    participant Val as Validation Layer
    participant GQL as GraphQL Client
    participant Shopify as Shopify Admin API

    Note over Dev, Shopify: Schema Definition & Application Flow
    
    Dev->>CLI: Define schema.ts
    Dev->>CLI: Run "tento push"
    CLI->>Client: Load local schema
    Client->>Val: Validate schema definitions
    Val-->>Client: Validation results
    Client->>GQL: Build schema mutations
    GQL->>Shopify: Apply metaobject definitions
    Shopify-->>GQL: Confirmation/errors
    GQL-->>Client: Operation results
    Client-->>CLI: Schema application status
    CLI-->>Dev: Success/error feedback

    Note over Dev, Shopify: Data Query Flow
    
    Dev->>Client: Query metaobjects
    Client->>Val: Validate query parameters
    Val-->>Client: Validation results
    Client->>GQL: Build GraphQL query
    GQL->>Shopify: Execute query
    Shopify-->>GQL: Metaobject data
    GQL-->>Client: Typed results
    Client-->>Dev: Type-safe data
```

## Technology Stack

### Runtime Environment
- **Node.js** - Runtime environment
- **TypeScript** - Primary language with full type safety
- **PNPM** - Package management

### Core Dependencies
- **GraphQL** - Query language for Shopify Admin API
- **Valibot** - Schema validation library
- **Shopify Admin API Client** - Official Shopify GraphQL client

### Development Tools
- **GraphQL Code Generator** - Automatic type generation
- **Biome** - Linting and formatting
- **TSup** - TypeScript bundling
- **esbuild** - Fast bundling for production

## Key Design Principles

### 1. Type Safety First
- Full TypeScript coverage with strict typing
- Generated types from Shopify GraphQL schema
- Runtime validation matching compile-time types

### 2. Developer Experience
- Intuitive API design following familiar patterns
- Comprehensive error messages with actionable feedback
- CLI tool for common operations

### 3. Schema-Driven Development
- Local schema definitions as source of truth
- Bidirectional synchronization with Shopify
- Validation and diffing capabilities

### 4. Modular Architecture
- Clear separation of concerns between components
- Plugin-like extensibility for field types
- Configurable client adapters for different Shopify setups

## Security Considerations

### Authentication
- Support for OAuth 2.0 flows
- Admin API access token management
- Configurable authentication headers

### Data Validation
- Server-side validation enforcement
- Type-safe query construction preventing injection
- Field-level validation rules with custom constraints

### API Rate Limiting
- Built-in retry mechanisms
- Configurable request throttling
- Error handling for rate limit responses