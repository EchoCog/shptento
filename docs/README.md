# Tento Technical Architecture Documentation

This directory contains comprehensive technical architecture documentation for the Tento Shopify data framework.

## Documentation Structure

- **[Architecture Overview](./architecture-overview.md)** - High-level system components and relationships
- **[Client Library Architecture](./client-architecture.md)** - Internal structure and data flow
- **[CLI Tool Architecture](./cli-architecture.md)** - Command processing and schema management
- **[GraphQL Integration](./graphql-integration.md)** - API interaction patterns and data mapping
- **[Schema Management](./schema-management.md)** - Definition, validation, and synchronization flows
- **[Authentication Flows](./authentication-flows.md)** - OAuth and API key management
- **[Error Handling](./error-handling.md)** - Exception flows and validation patterns

## Diagram Legend

The documentation uses Mermaid diagrams with the following conventions:

- **Blue** boxes represent core Tento components
- **Green** boxes represent external Shopify services
- **Orange** boxes represent user/developer interfaces
- **Purple** boxes represent data stores/schemas
- **Yellow** boxes represent validation/processing steps

## Quick Reference

### Core Components
- **Client Library** - Type-safe Shopify metaobject interactions
- **CLI Tool** - Schema management and synchronization
- **GraphQL Layer** - Auto-generated types and queries
- **Field System** - Type definitions and validations

### Key Flows
1. Schema definition → Validation → Application to Shopify
2. Shopify data → Query building → Type-safe results
3. CLI commands → Schema synchronization → Local/remote alignment