# Client Library Architecture

This document details the internal architecture of the Tento client library, which provides type-safe interactions with Shopify metaobjects.

## Client Library Overview

The client library is the core component that developers interact with directly. It provides a fluent API for defining, validating, and querying Shopify metaobjects.

```mermaid
graph TB
    subgraph "Client Library Structure"
        Entry[index.ts - Main Export]
        
        subgraph "Core Components"
            MetaObj[metaobject.ts]
            Field[field.ts] 
            Validation[validations.ts]
            Types[types.ts]
        end
        
        subgraph "Query System"
            Query[query.ts]
            GQLClient[gql-client.ts]
        end
        
        subgraph "Schema Management"
            ApplySchema[apply-schema.ts]
            Diff[diff.ts]
        end
    end
    
    Entry --> MetaObj
    Entry --> Field
    Entry --> Query
    Entry --> GQLClient
    
    MetaObj --> Field
    MetaObj --> Validation
    MetaObj --> Types
    
    Query --> GQLClient
    Query --> Types
    
    ApplySchema --> Diff
    ApplySchema --> GQLClient
    ApplySchema --> MetaObj
    
    style Entry fill:#9cf
    style MetaObj fill:#9cf
    style Field fill:#9cf
    style Validation fill:#ff9
    style Types fill:#e1e
    style Query fill:#9cf
    style GQLClient fill:#9cf
    style ApplySchema fill:#9cf
    style Diff fill:#ff9
```

## Core Components Deep Dive

### 1. Metaobject System (`metaobject.ts`)

The central component for defining and managing metaobject schemas:

```mermaid
classDiagram
    class Metaobject {
        +config: MetaobjectDefinition
        +create(definition): Metaobject
        +validate(): ValidationResult
        +toShopifyDefinition(): ShopifyMetaobjectDefinition
    }
    
    class MetaobjectDefinition {
        +name: string
        +type: string
        +fieldDefinitions: FieldDefinitionMap
        +description?: string
        +access?: AccessConfiguration
    }
    
    class FieldDefinitionMap {
        +[key: string]: FieldDefinition
    }
    
    class FieldDefinition {
        +name: string
        +type: FieldType
        +required: boolean
        +validations: Validation[]
        +description?: string
    }
    
    Metaobject --> MetaobjectDefinition
    MetaobjectDefinition --> FieldDefinitionMap
    FieldDefinitionMap --> FieldDefinition
```

### 2. Field System (`field.ts`)

Provides typed field definitions with validation support:

```mermaid
graph TB
    subgraph "Field Types"
        SingleLine[Single Line Text]
        MultiLine[Multi Line Text]
        Integer[Integer]
        Decimal[Decimal]
        Date[Date]
        DateTime[Date Time]
        URL[URL]
        Boolean[Boolean]
        FileRef[File Reference]
        ProductRef[Product Reference]
        Dimension[Dimension]
        Volume[Volume]
        Weight[Weight]
        Rating[Rating]
        Color[Color]
        JSON[JSON]
    end
    
    subgraph "Field Builder"
        Builder[Field Builder Function]
        ValidationChain[Validation Chain]
        TypeSafety[Type Safety Layer]
    end
    
    Builder --> SingleLine
    Builder --> MultiLine
    Builder --> Integer
    Builder --> Decimal
    Builder --> Date
    Builder --> DateTime
    Builder --> URL
    Builder --> Boolean
    Builder --> FileRef
    Builder --> ProductRef
    Builder --> Dimension
    Builder --> Volume
    Builder --> Weight
    Builder --> Rating
    Builder --> Color
    Builder --> JSON
    
    Builder --> ValidationChain
    ValidationChain --> TypeSafety
    
    style Builder fill:#9cf
    style ValidationChain fill:#ff9
    style TypeSafety fill:#ff9
```

### 3. Validation System (`validations.ts`)

Comprehensive validation framework for field values:

```mermaid
graph LR
    subgraph "Validation Types"
        String[String Validations]
        Numeric[Numeric Validations]
        Date[Date Validations]
        URL[URL Validations]
        Custom[Custom Validations]
    end
    
    subgraph "String Validations"
        MinLength[min(length)]
        MaxLength[max(length)]
        Regex[regex(pattern)]
        Enum[oneOf(values)]
    end
    
    subgraph "Numeric Validations"
        MinValue[min(value)]
        MaxValue[max(value)]
        Precision[maxPrecision(digits)]
        Step[step(increment)]
    end
    
    subgraph "Date Validations"
        MinDate[min(date)]
        MaxDate[max(date)]
        DateFormat[format(pattern)]
    end
    
    subgraph "URL Validations"
        AllowedDomains[allowedDomains(list)]
        Protocol[requireProtocol()]
    end
    
    String --> MinLength
    String --> MaxLength
    String --> Regex
    String --> Enum
    
    Numeric --> MinValue
    Numeric --> MaxValue
    Numeric --> Precision
    Numeric --> Step
    
    Date --> MinDate
    Date --> MaxDate
    Date --> DateFormat
    
    URL --> AllowedDomains
    URL --> Protocol
    
    style String fill:#9cf
    style Numeric fill:#9cf
    style Date fill:#9cf
    style URL fill:#9cf
    style Custom fill:#9cf
```

### 4. Query System (`query.ts`)

Type-safe query building and execution:

```mermaid
sequenceDiagram
    participant App as Application
    participant QB as Query Builder
    participant Val as Validator
    participant GQL as GraphQL Client
    participant Cache as Query Cache
    participant API as Shopify Admin API

    App->>QB: Create query request
    QB->>Val: Validate query parameters
    Val-->>QB: Validation result
    
    alt Validation passes
        QB->>Cache: Check query cache
        alt Cache hit
            Cache-->>QB: Cached results
            QB-->>App: Return cached data
        else Cache miss
            QB->>GQL: Build GraphQL query
            GQL->>API: Execute query
            API-->>GQL: Raw response
            GQL->>QB: Transform response
            QB->>Cache: Store results
            QB-->>App: Return typed data
        end
    else Validation fails
        Val-->>App: Validation errors
    end
```

### 5. GraphQL Client (`gql-client.ts`)

Adapter layer for various Shopify GraphQL clients:

```mermaid
graph TB
    subgraph "Client Adapters"
        TentoClient[Tento Client Interface]
        ShopifyAPI[Shopify API Client]
        AdminClient[Admin API Client]
        CustomFetch[Custom Fetch Client]
        OAuthClient[OAuth Client]
    end
    
    subgraph "Request Processing"
        RequestBuilder[Request Builder]
        HeaderManager[Header Manager]
        ErrorHandler[Error Handler]
        ResponseTransformer[Response Transformer]
    end
    
    TentoClient --> ShopifyAPI
    TentoClient --> AdminClient
    TentoClient --> CustomFetch
    TentoClient --> OAuthClient
    
    ShopifyAPI --> RequestBuilder
    AdminClient --> RequestBuilder
    CustomFetch --> RequestBuilder
    OAuthClient --> RequestBuilder
    
    RequestBuilder --> HeaderManager
    RequestBuilder --> ErrorHandler
    RequestBuilder --> ResponseTransformer
    
    style TentoClient fill:#9cf
    style RequestBuilder fill:#ff9
    style HeaderManager fill:#ff9
    style ErrorHandler fill:#ff9
    style ResponseTransformer fill:#ff9
```

## Data Flow Patterns

### 1. Schema Definition Flow

```mermaid
flowchart TD
    Dev[Developer defines schema] --> Schema[schema.ts file]
    Schema --> MetaObj[Metaobject constructor]
    MetaObj --> FieldDef[Field definitions]
    FieldDef --> Validation[Apply validations]
    Validation --> TypeGen[Generate TypeScript types]
    TypeGen --> Export[Export for use]
    
    style Dev fill:#ff9
    style Schema fill:#e1e
    style MetaObj fill:#9cf
    style FieldDef fill:#9cf
    style Validation fill:#ff9
    style TypeGen fill:#ff9
    style Export fill:#9cf
```

### 2. Query Execution Flow

```mermaid
flowchart TD
    Query[Query request] --> Validate[Validate parameters]
    Validate --> BuildGQL[Build GraphQL query]
    BuildGQL --> Execute[Execute via client]
    Execute --> Transform[Transform response]
    Transform --> TypeCheck[Type checking]
    TypeCheck --> Return[Return typed results]
    
    Validate -->|Invalid| Error[Return validation errors]
    Execute -->|API Error| HandleError[Handle API errors]
    
    style Query fill:#ff9
    style Validate fill:#ff9
    style BuildGQL fill:#9cf
    style Execute fill:#9cf
    style Transform fill:#9cf
    style TypeCheck fill:#ff9
    style Return fill:#9cf
    style Error fill:#f99
    style HandleError fill:#f99
```

### 3. Schema Application Flow

```mermaid
flowchart TD
    LocalSchema[Local schema definition] --> Diff[Compare with remote]
    RemoteSchema[Remote Shopify schema] --> Diff
    Diff --> Changes{Changes detected?}
    
    Changes -->|Yes| Plan[Create migration plan]
    Changes -->|No| NoOp[No operation needed]
    
    Plan --> Validate[Validate changes]
    Validate --> Apply[Apply to Shopify]
    Apply --> Confirm[Confirm application]
    Confirm --> Update[Update local state]
    
    Validate -->|Invalid| Error[Report errors]
    Apply -->|Failed| Retry[Retry logic]
    
    style LocalSchema fill:#e1e
    style RemoteSchema fill:#9f9
    style Diff fill:#ff9
    style Plan fill:#9cf
    style Validate fill:#ff9
    style Apply fill:#9cf
    style Confirm fill:#9cf
    style Update fill:#9cf
    style Error fill:#f99
    style Retry fill:#ff9
    style NoOp fill:#ccc
```

## Type Safety Implementation

### 1. Compile-time Type Safety

```typescript
// Example of type-safe schema definition
export const product = metaobject({
  name: 'Product',
  type: 'product',
  fieldDefinitions: (f) => ({
    title: f.singleLineTextField({
      name: 'Title',
      required: true,
      validations: (v) => [v.min(1), v.max(100)]
    }),
    price: f.decimal({
      name: 'Price', 
      required: true,
      validations: (v) => [v.min(0), v.maxPrecision(2)]
    })
  })
});

// Type is automatically inferred:
// {
//   _id: string;
//   _handle: string;
//   _updatedAt: Date;
//   title: string;
//   price: number;
// }
```

### 2. Runtime Validation Integration

```mermaid
graph LR
    CompileTime[Compile-time Types] --> Runtime[Runtime Validation]
    Runtime --> APICall[API Interaction]
    APICall --> TypedResult[Typed Results]
    
    CompileTime -->|generates| ValidationRules[Validation Rules]
    ValidationRules --> Runtime
    
    style CompileTime fill:#ff9
    style Runtime fill:#ff9
    style ValidationRules fill:#ff9
    style APICall fill:#9cf
    style TypedResult fill:#9cf
```

## Error Handling Strategy

### 1. Error Categories

```mermaid
graph TB
    Errors[Error Types]
    
    Errors --> Validation[Validation Errors]
    Errors --> Network[Network Errors]
    Errors --> API[API Errors]
    Errors --> Type[Type Errors]
    
    Validation --> FieldVal[Field Validation]
    Validation --> SchemaVal[Schema Validation]
    
    Network --> Timeout[Timeout]
    Network --> Connection[Connection Failed]
    Network --> RateLimit[Rate Limited]
    
    API --> NotFound[Resource Not Found]
    API --> Unauthorized[Unauthorized]
    API --> GraphQLError[GraphQL Errors]
    
    Type --> TypeMismatch[Type Mismatch]
    Type --> MissingField[Missing Required Field]
    
    style Errors fill:#f99
    style Validation fill:#f99
    style Network fill:#f99
    style API fill:#f99
    style Type fill:#f99
```

### 2. Error Recovery Patterns

```mermaid
sequenceDiagram
    participant Client as Client Library
    participant Retry as Retry Logic
    participant Fallback as Fallback Handler
    participant Logger as Error Logger
    participant User as User Application

    Client->>Client: Operation fails
    Client->>Logger: Log error details
    
    alt Retryable error
        Client->>Retry: Attempt retry
        Retry->>Client: Retry operation
        alt Retry succeeds
            Client->>User: Return success
        else Max retries exceeded
            Client->>Fallback: Use fallback
            Fallback->>User: Return fallback result
        end
    else Non-retryable error
        Client->>User: Return error immediately
    end
```

## Performance Optimizations

### 1. Query Optimization

- **Field Selection**: Only request needed fields from GraphQL API
- **Batch Queries**: Combine multiple requests when possible
- **Query Caching**: Cache frequently used queries
- **Pagination**: Efficient handling of large datasets

### 2. Memory Management

- **Lazy Loading**: Load schema definitions on demand
- **Object Pooling**: Reuse validation objects
- **Stream Processing**: Handle large responses as streams
- **Garbage Collection**: Proper cleanup of resources

### 3. Network Optimization

- **Request Compression**: Compress GraphQL queries
- **Connection Pooling**: Reuse HTTP connections
- **Retry Strategies**: Exponential backoff for failures
- **Rate Limiting**: Respect Shopify API limits