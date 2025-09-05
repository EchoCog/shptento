# GraphQL Integration Architecture

This document details how Tento integrates with Shopify's GraphQL Admin API, including type generation, query building, and response handling.

## GraphQL Integration Overview

Tento uses GraphQL as the primary interface to Shopify's Admin API, providing type-safe operations for metaobjects and metafields management.

```mermaid
graph TB
    subgraph "GraphQL Layer"
        CodeGen[GraphQL Code Generator]
        Schema[Shopify GraphQL Schema]
        Operations[GraphQL Operations]
        Types[Generated Types]
        Client[GraphQL Client]
    end
    
    subgraph "Shopify Admin API"
        AdminAPI[Admin GraphQL Endpoint]
        MetaObjects[Metaobject API]
        MetaFields[Metafield API]
        Products[Product API]
    end
    
    subgraph "Tento Integration"
        QueryBuilder[Query Builder]
        ResponseParser[Response Parser]
        TypeMapper[Type Mapper]
        ErrorHandler[Error Handler]
    end
    
    CodeGen -->|fetches| Schema
    Schema -->|from| AdminAPI
    CodeGen -->|generates| Types
    CodeGen -->|processes| Operations
    
    Client -->|uses| Types
    Client -->|executes| Operations
    Client -->|connects to| AdminAPI
    
    QueryBuilder -->|builds| Operations
    ResponseParser -->|processes| Types
    TypeMapper -->|maps| Types
    
    AdminAPI --> MetaObjects
    AdminAPI --> MetaFields
    AdminAPI --> Products
    
    style CodeGen fill:#9cf
    style Schema fill:#9f9
    style Operations fill:#e1e
    style Types fill:#e1e
    style Client fill:#9cf
    style AdminAPI fill:#9f9
    style QueryBuilder fill:#9cf
    style ResponseParser fill:#9cf
    style TypeMapper fill:#9cf
    style ErrorHandler fill:#f99
```

## Code Generation Pipeline

### 1. Schema Introspection

The GraphQL code generator fetches and processes Shopify's schema:

```mermaid
sequenceDiagram
    participant CodeGen as GraphQL Codegen
    participant Config as .graphqlrc.ts
    participant Shopify as Shopify Admin API
    participant Parser as Schema Parser
    participant Generator as Type Generator
    participant Output as Generated Files

    CodeGen->>Config: Load configuration
    Config->>Shopify: Introspection query
    Shopify-->>Config: Schema definition
    Config->>Parser: Parse schema
    Parser->>Generator: Process types
    Generator->>Output: Generate TypeScript types
    
    Note over CodeGen, Output: Generates src/graphql/gen/
```

### 2. Operation Processing

GraphQL operations are processed and typed:

```mermaid
graph TB
    subgraph "GraphQL Operations"
        Queries[Query Operations]
        Mutations[Mutation Operations]
        Fragments[Fragment Definitions]
        Subscriptions[Subscription Operations]
    end
    
    subgraph "Operation Categories"
        MetaObjectOps[Metaobject Operations]
        MetaFieldOps[Metafield Operations]
        SchemaOps[Schema Operations]
        SearchOps[Search Operations]
    end
    
    subgraph "Generated Assets"
        TypeDefs[Type Definitions]
        DocumentNodes[Document Nodes]
        Hooks[Query Hooks]
        Utilities[Utility Functions]
    end
    
    Queries --> MetaObjectOps
    Mutations --> MetaObjectOps
    Fragments --> MetaObjectOps
    
    Queries --> MetaFieldOps
    Mutations --> MetaFieldOps
    
    Queries --> SchemaOps
    Mutations --> SchemaOps
    
    Queries --> SearchOps
    
    MetaObjectOps --> TypeDefs
    MetaFieldOps --> TypeDefs
    SchemaOps --> TypeDefs
    SearchOps --> TypeDefs
    
    TypeDefs --> DocumentNodes
    TypeDefs --> Hooks
    TypeDefs --> Utilities
    
    style Queries fill:#9cf
    style Mutations fill:#9cf
    style Fragments fill:#9cf
    style Subscriptions fill:#9cf
    style TypeDefs fill:#e1e
    style DocumentNodes fill:#e1e
    style Hooks fill:#e1e
    style Utilities fill:#e1e
```

## Query Building System

### 1. Dynamic Query Construction

Tento builds GraphQL queries dynamically based on schema definitions:

```mermaid
flowchart TD
    Schema[Schema Definition] --> Analyzer[Query Analyzer]
    Request[Query Request] --> Analyzer
    
    Analyzer --> FieldSelection[Field Selection]
    Analyzer --> FilterBuilder[Filter Builder]
    Analyzer --> SortBuilder[Sort Builder]
    Analyzer --> PaginationBuilder[Pagination Builder]
    
    FieldSelection --> QueryDoc[Query Document]
    FilterBuilder --> QueryDoc
    SortBuilder --> QueryDoc
    PaginationBuilder --> QueryDoc
    
    QueryDoc --> Variables[Query Variables]
    QueryDoc --> Validation[Query Validation]
    
    Validation --> Execute[Execute Query]
    Variables --> Execute
    
    style Schema fill:#e1e
    style Request fill:#ff9
    style Analyzer fill:#9cf
    style FieldSelection fill:#9cf
    style FilterBuilder fill:#9cf
    style SortBuilder fill:#9cf
    style PaginationBuilder fill:#9cf
    style QueryDoc fill:#e1e
    style Variables fill:#e1e
    style Validation fill:#ff9
    style Execute fill:#9cf
```

### 2. Query Optimization

```mermaid
graph LR
    subgraph "Query Optimizations"
        FieldPruning[Field Pruning]
        QueryCombining[Query Combining]
        Caching[Query Caching]
        Batching[Request Batching]
    end
    
    subgraph "Performance Features"
        LazyLoading[Lazy Loading]
        Pagination[Smart Pagination]
        Prefetching[Data Prefetching]
        Deduplication[Request Deduplication]
    end
    
    FieldPruning --> LazyLoading
    QueryCombining --> Batching
    Caching --> Deduplication
    Batching --> Prefetching
    
    LazyLoading --> Performance[Better Performance]
    Pagination --> Performance
    Prefetching --> Performance
    Deduplication --> Performance
    
    style FieldPruning fill:#9cf
    style QueryCombining fill:#9cf
    style Caching fill:#9cf
    style Batching fill:#9cf
    style LazyLoading fill:#ff9
    style Pagination fill:#ff9
    style Prefetching fill:#ff9
    style Deduplication fill:#ff9
    style Performance fill:#9f9
```

## Type System Integration

### 1. TypeScript Type Generation

```typescript
// Example of generated types
export interface MetaobjectDefinition {
  id: string;
  name: string;
  type: string;
  fieldDefinitions: MetaobjectFieldDefinition[];
  access: MetaobjectAccess;
  capabilities: MetaobjectCapabilities;
}

export interface MetaobjectFieldDefinition {
  key: string;
  name: string;
  type: MetaobjectFieldType;
  required: boolean;
  validations: MetaobjectFieldValidation[];
}

// Query result types
export interface MetaobjectListQuery {
  metaobjects: {
    edges: Array<{
      node: Metaobject;
      cursor: string;
    }>;
    pageInfo: PageInfo;
  };
}
```

### 2. Runtime Type Mapping

```mermaid
sequenceDiagram
    participant Client as Tento Client
    participant Mapper as Type Mapper
    participant Parser as Response Parser
    participant Validator as Type Validator
    participant Result as Typed Result

    Client->>Parser: Raw GraphQL response
    Parser->>Mapper: Parsed data
    Mapper->>Validator: Map to internal types
    Validator->>Result: Validate & transform
    Result-->>Client: Type-safe objects
    
    Note over Mapper, Validator: Handles field transformations
    Note over Validator, Result: Ensures type safety
```

## API Operation Patterns

### 1. Metaobject Operations

```mermaid
graph TB
    subgraph "Metaobject CRUD"
        Create[Create Metaobject]
        Read[Read Metaobject]
        Update[Update Metaobject]
        Delete[Delete Metaobject]
        List[List Metaobjects]
    end
    
    subgraph "Definition Management"
        CreateDef[Create Definition]
        UpdateDef[Update Definition]
        DeleteDef[Delete Definition]
        ListDefs[List Definitions]
    end
    
    subgraph "Query Operations"
        Search[Search Metaobjects]
        Filter[Filter Results]
        Sort[Sort Results]
        Paginate[Paginate Results]
    end
    
    Create --> CreateDef
    Update --> UpdateDef
    Delete --> DeleteDef
    List --> ListDefs
    
    List --> Search
    Search --> Filter
    Filter --> Sort
    Sort --> Paginate
    
    style Create fill:#9cf
    style Read fill:#9cf
    style Update fill:#9cf
    style Delete fill:#9cf
    style List fill:#9cf
    style CreateDef fill:#ff9
    style UpdateDef fill:#ff9
    style DeleteDef fill:#ff9
    style ListDefs fill:#ff9
```

### 2. Schema Synchronization Operations

```mermaid
sequenceDiagram
    participant CLI as CLI Tool
    participant Differ as Schema Differ
    participant Builder as Mutation Builder
    participant API as Shopify API
    participant Validator as Response Validator

    Note over CLI, Validator: Push Operation Flow
    
    CLI->>Differ: Compare local vs remote schema
    Differ->>Builder: Build required mutations
    Builder->>API: Execute schema mutations
    API-->>Validator: Response validation
    Validator-->>CLI: Confirm changes applied
    
    Note over CLI, Validator: Pull Operation Flow
    
    CLI->>API: Fetch remote schema
    API-->>Builder: Raw schema data
    Builder->>Differ: Transform to local format
    Differ-->>CLI: Generated schema file
```

## Error Handling and Resilience

### 1. GraphQL Error Types

```mermaid
graph TB
    GraphQLErrors[GraphQL Errors] --> UserErrors[User Errors]
    GraphQLErrors --> SystemErrors[System Errors]
    GraphQLErrors --> NetworkErrors[Network Errors]
    
    UserErrors --> ValidationFailed[Validation Failed]
    UserErrors --> NotFound[Resource Not Found]
    UserErrors --> PermissionDenied[Permission Denied]
    UserErrors --> RateLimited[Rate Limited]
    
    SystemErrors --> InternalError[Internal Server Error]
    SystemErrors --> ServiceUnavailable[Service Unavailable]
    SystemErrors --> Timeout[Request Timeout]
    
    NetworkErrors --> ConnectionFailed[Connection Failed]
    NetworkErrors --> DNSError[DNS Resolution Error]
    NetworkErrors --> SSLError[SSL Certificate Error]
    
    style GraphQLErrors fill:#f99
    style UserErrors fill:#ffc
    style SystemErrors fill:#f99
    style NetworkErrors fill:#f99
    style ValidationFailed fill:#ffc
    style NotFound fill:#ffc
    style PermissionDenied fill:#ffc
    style RateLimited fill:#ffc
```

### 2. Error Recovery Strategies

```mermaid
flowchart TD
    Error[GraphQL Error] --> Classify[Classify Error Type]
    
    Classify --> Retryable{Retryable?}
    Classify --> UserError{User Error?}
    Classify --> SystemError{System Error?}
    
    Retryable -->|Yes| Retry[Retry with Backoff]
    Retryable -->|No| Report[Report Error]
    
    UserError -->|Yes| UserFeedback[Provide User Feedback]
    UserError -->|No| SystemError
    
    SystemError -->|Yes| Fallback[Use Fallback Strategy]
    SystemError -->|No| Report
    
    Retry --> Success{Success?}
    Success -->|Yes| Continue[Continue Operation]
    Success -->|No| MaxRetries{Max Retries?}
    
    MaxRetries -->|Reached| Report
    MaxRetries -->|Not Reached| Retry
    
    style Error fill:#f99
    style Classify fill:#ff9
    style Retry fill:#9cf
    style Report fill:#f99
    style UserFeedback fill:#ff9
    style Fallback fill:#9cf
    style Continue fill:#9f9
```

## Authentication and Authorization

### 1. Authentication Flow

```mermaid
sequenceDiagram
    participant Client as Tento Client
    participant Config as Configuration
    participant Auth as Auth Handler
    participant Shopify as Shopify Admin API
    participant Token as Token Store

    Client->>Config: Load authentication config
    Config->>Auth: Initialize auth handler
    
    alt OAuth Flow
        Auth->>Shopify: Initiate OAuth flow
        Shopify-->>Auth: Authorization code
        Auth->>Shopify: Exchange for access token
        Shopify-->>Auth: Access token
        Auth->>Token: Store token
    else API Key Flow
        Auth->>Token: Use provided API key
    end
    
    Client->>Auth: Request authenticated operation
    Auth->>Token: Retrieve token
    Token-->>Auth: Access token
    Auth->>Shopify: API request with token
    Shopify-->>Auth: Response
    Auth-->>Client: Authenticated response
```

### 2. Permission Management

```mermaid
graph TB
    subgraph "Required Permissions"
        MetaObjRead[read_metaobjects]
        MetaObjWrite[write_metaobjects]
        MetaFieldRead[read_metafields]
        MetaFieldWrite[write_metafields]
        ProductRead[read_products]
    end
    
    subgraph "Operations"
        ReadOps[Read Operations]
        WriteOps[Write Operations]
        SchemaOps[Schema Operations]
        SearchOps[Search Operations]
    end
    
    MetaObjRead --> ReadOps
    MetaObjRead --> SearchOps
    MetaObjWrite --> WriteOps
    MetaObjWrite --> SchemaOps
    MetaFieldRead --> ReadOps
    MetaFieldWrite --> WriteOps
    ProductRead --> SearchOps
    
    style MetaObjRead fill:#9f9
    style MetaObjWrite fill:#ff9
    style MetaFieldRead fill:#9f9
    style MetaFieldWrite fill:#ff9
    style ProductRead fill:#9f9
    style ReadOps fill:#9cf
    style WriteOps fill:#ffc
    style SchemaOps fill:#ffc
    style SearchOps fill:#9cf
```

## Performance Optimization

### 1. Query Performance

```mermaid
graph LR
    subgraph "Query Optimizations"
        FieldSelection[Selective Field Queries]
        QueryDepth[Query Depth Limiting]
        BatchRequests[Request Batching]
        Caching[Response Caching]
    end
    
    subgraph "Network Optimizations"
        Compression[Request Compression]
        KeepAlive[Connection Keep-Alive]
        Pooling[Connection Pooling]
        CDN[CDN Usage]
    end
    
    subgraph "Data Optimizations"
        Pagination[Smart Pagination]
        LazyLoading[Lazy Loading]
        Prefetching[Data Prefetching]
        Streaming[Response Streaming]
    end
    
    FieldSelection --> Performance[Better Performance]
    QueryDepth --> Performance
    BatchRequests --> Performance
    Caching --> Performance
    
    Compression --> Performance
    KeepAlive --> Performance
    Pooling --> Performance
    CDN --> Performance
    
    Pagination --> Performance
    LazyLoading --> Performance
    Prefetching --> Performance
    Streaming --> Performance
    
    style Performance fill:#9f9
```

### 2. Rate Limiting Handling

```mermaid
sequenceDiagram
    participant Client as GraphQL Client
    participant RateLimit as Rate Limiter
    participant Queue as Request Queue
    participant Retry as Retry Logic
    participant API as Shopify API

    Client->>RateLimit: Check rate limit
    RateLimit->>Queue: Queue request if needed
    Queue->>API: Execute request
    
    alt Rate limit exceeded
        API-->>Retry: 429 Rate Limited
        Retry->>RateLimit: Calculate backoff
        RateLimit->>Queue: Requeue with delay
        Queue->>API: Retry request
        API-->>Client: Success response
    else Request succeeds
        API-->>Client: Success response
    end
    
    Note over RateLimit, Queue: Implements exponential backoff
    Note over Queue, API: Respects Shopify rate limits
```

## Data Transformation Pipeline

### 1. Response Processing

```mermaid
flowchart TD
    Response[Raw GraphQL Response] --> Parser[Response Parser]
    Parser --> Validator[Schema Validator]
    Validator --> Transformer[Data Transformer]
    Transformer --> TypeChecker[Type Checker]
    TypeChecker --> Result[Typed Result]
    
    Parser -->|Parse Error| ErrorHandler[Error Handler]
    Validator -->|Validation Error| ErrorHandler
    Transformer -->|Transform Error| ErrorHandler
    TypeChecker -->|Type Error| ErrorHandler
    
    ErrorHandler --> ErrorResult[Error Result]
    
    style Response fill:#e1e
    style Parser fill:#9cf
    style Validator fill:#ff9
    style Transformer fill:#9cf
    style TypeChecker fill:#ff9
    style Result fill:#9f9
    style ErrorHandler fill:#f99
    style ErrorResult fill:#f99
```

### 2. Field Value Mapping

```mermaid
graph TB
    subgraph "Shopify Types"
        StringField[String]
        IntField[Integer]
        DecimalField[Decimal]
        DateField[Date]
        DateTimeField[DateTime]
        URLField[URL]
        BooleanField[Boolean]
        FileField[File Reference]
        ProductField[Product Reference]
    end
    
    subgraph "TypeScript Types"
        TSString[string]
        TSNumber[number]
        TSDate[Date]
        TSURL[string with URL validation]
        TSBoolean[boolean]
        TSFile[FileReference interface]
        TSProduct[ProductReference interface]
    end
    
    StringField --> TSString
    IntField --> TSNumber
    DecimalField --> TSNumber
    DateField --> TSDate
    DateTimeField --> TSDate
    URLField --> TSURL
    BooleanField --> TSBoolean
    FileField --> TSFile
    ProductField --> TSProduct
    
    style StringField fill:#9f9
    style IntField fill:#9f9
    style DecimalField fill:#9f9
    style DateField fill:#9f9
    style DateTimeField fill:#9f9
    style URLField fill:#9f9
    style BooleanField fill:#9f9
    style FileField fill:#9f9
    style ProductField fill:#9f9
    style TSString fill:#e1e
    style TSNumber fill:#e1e
    style TSDate fill:#e1e
    style TSURL fill:#e1e
    style TSBoolean fill:#e1e
    style TSFile fill:#e1e
    style TSProduct fill:#e1e
```

## Integration Testing Strategy

### 1. GraphQL Integration Tests

```mermaid
graph TB
    subgraph "Test Categories"
        SchemaTests[Schema Tests]
        QueryTests[Query Tests]
        MutationTests[Mutation Tests]
        ErrorTests[Error Handling Tests]
    end
    
    subgraph "Test Environment"
        MockServer[Mock GraphQL Server]
        TestData[Test Data Sets]
        Fixtures[Test Fixtures]
        Validators[Response Validators]
    end
    
    SchemaTests --> MockServer
    QueryTests --> MockServer
    MutationTests --> MockServer
    ErrorTests --> MockServer
    
    MockServer --> TestData
    MockServer --> Fixtures
    MockServer --> Validators
    
    style SchemaTests fill:#9cf
    style QueryTests fill:#9cf
    style MutationTests fill:#9cf
    style ErrorTests fill:#9cf
    style MockServer fill:#ff9
    style TestData fill:#e1e
    style Fixtures fill:#e1e
    style Validators fill:#ff9
```

### 2. End-to-End Testing

```mermaid
sequenceDiagram
    participant Test as Test Suite
    participant Mock as Mock Shopify API
    participant Client as Tento Client
    participant Validator as Test Validator

    Test->>Mock: Setup test scenario
    Test->>Client: Execute operation
    Client->>Mock: GraphQL request
    Mock-->>Client: Mock response
    Client-->>Test: Operation result
    Test->>Validator: Validate result
    Validator-->>Test: Validation outcome
    
    Note over Test, Validator: Tests cover all GraphQL patterns
    Note over Mock, Client: Simulates real Shopify behavior
```