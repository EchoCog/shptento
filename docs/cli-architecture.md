# CLI Tool Architecture

This document details the architecture of the Tento CLI tool, which provides command-line interface for schema management and synchronization with Shopify.

## CLI Overview

The Tento CLI is a command-line tool that allows developers to manage metaobject schemas, synchronize between local definitions and Shopify, and perform various administrative tasks.

```mermaid
graph TB
    subgraph "CLI Entry Points"
        Binary[tento binary]
        NPX[npx tento]
        Yarn[yarn tento]
        PNPM[pnpm tento]
    end
    
    subgraph "CLI Core"
        Entry[cli.ts - Main Entry]
        Index[index.ts - Config & Utils]
        Commands[Command Handlers]
    end
    
    subgraph "Command Types"
        Pull[Pull Command]
        Push[Push Command]
        Init[Init Command]
        Status[Status Command]
        Validate[Validate Command]
    end
    
    subgraph "Configuration"
        ConfigFile[tento.config.ts]
        SchemaFile[schema.ts]
        EnvVars[Environment Variables]
    end
    
    Binary --> Entry
    NPX --> Entry
    Yarn --> Entry
    PNPM --> Entry
    
    Entry --> Commands
    Entry --> Index
    
    Commands --> Pull
    Commands --> Push
    Commands --> Init
    Commands --> Status
    Commands --> Validate
    
    Index --> ConfigFile
    Index --> SchemaFile
    Index --> EnvVars
    
    style Entry fill:#9cf
    style Commands fill:#9cf
    style Pull fill:#9cf
    style Push fill:#9cf
    style Init fill:#9cf
    style Status fill:#9cf
    style Validate fill:#9cf
    style ConfigFile fill:#e1e
    style SchemaFile fill:#e1e
    style EnvVars fill:#e1e
```

## Command Architecture

### 1. Command Structure

Each CLI command follows a consistent pattern for processing and execution:

```mermaid
sequenceDiagram
    participant User as User
    participant CLI as CLI Entry
    participant Parser as Argument Parser
    participant Config as Config Loader
    participant Schema as Schema Loader
    participant Handler as Command Handler
    participant Client as Tento Client
    participant Shopify as Shopify API

    User->>CLI: Execute command
    CLI->>Parser: Parse arguments
    Parser->>Config: Load configuration
    Config->>Schema: Load schema file
    Schema->>Handler: Initialize command
    Handler->>Client: Create client instance
    Client->>Shopify: Execute operations
    Shopify-->>Client: Return results
    Client-->>Handler: Process results
    Handler-->>CLI: Command completion
    CLI-->>User: Display results/errors
```

### 2. Configuration System

The CLI uses a layered configuration approach:

```mermaid
graph TB
    subgraph "Configuration Sources"
        CLIArgs[CLI Arguments]
        ConfigFile[tento.config.ts]
        EnvVars[Environment Variables]
        Defaults[Default Values]
    end
    
    subgraph "Configuration Resolution"
        Merger[Config Merger]
        Validator[Config Validator]
        Result[Final Configuration]
    end
    
    CLIArgs -->|highest priority| Merger
    ConfigFile -->|medium priority| Merger
    EnvVars -->|low priority| Merger
    Defaults -->|lowest priority| Merger
    
    Merger --> Validator
    Validator --> Result
    
    style CLIArgs fill:#ff9
    style ConfigFile fill:#e1e
    style EnvVars fill:#e1e
    style Defaults fill:#ccc
    style Merger fill:#9cf
    style Validator fill:#ff9
    style Result fill:#9cf
```

## Command Implementations

### 1. Pull Command

Synchronizes remote Shopify schema to local files:

```mermaid
flowchart TD
    Start[tento pull] --> LoadConfig[Load configuration]
    LoadConfig --> Connect[Connect to Shopify]
    Connect --> FetchRemote[Fetch remote schema]
    FetchRemote --> ParseRemote[Parse metaobjects]
    ParseRemote --> GenerateLocal[Generate local schema]
    GenerateLocal --> WriteFile[Write schema.ts]
    WriteFile --> Success[Pull completed]
    
    Connect -->|Auth Error| AuthError[Authentication failed]
    FetchRemote -->|API Error| APIError[API request failed]
    WriteFile -->|File Error| FileError[File write failed]
    
    style Start fill:#ff9
    style LoadConfig fill:#9cf
    style Connect fill:#9cf
    style FetchRemote fill:#9cf
    style ParseRemote fill:#9cf
    style GenerateLocal fill:#9cf
    style WriteFile fill:#9cf
    style Success fill:#9f9
    style AuthError fill:#f99
    style APIError fill:#f99
    style FileError fill:#f99
```

### 2. Push Command

Applies local schema changes to Shopify:

```mermaid
flowchart TD
    Start[tento push] --> LoadConfig[Load configuration]
    LoadConfig --> LoadLocal[Load local schema]
    LoadLocal --> FetchRemote[Fetch remote schema]
    FetchRemote --> Compare[Compare schemas]
    Compare --> Changes{Changes detected?}
    
    Changes -->|Yes| Plan[Create migration plan]
    Changes -->|No| NoChanges[No changes to apply]
    
    Plan --> Validate[Validate migration]
    Validate --> Confirm[Confirm with user]
    Confirm --> Apply[Apply changes]
    Apply --> Verify[Verify application]
    Verify --> Success[Push completed]
    
    Validate -->|Invalid| ValidationError[Validation failed]
    Apply -->|Failed| ApplicationError[Application failed]
    
    style Start fill:#ff9
    style LoadConfig fill:#9cf
    style LoadLocal fill:#9cf
    style FetchRemote fill:#9cf
    style Compare fill:#ff9
    style Plan fill:#9cf
    style Validate fill:#ff9
    style Confirm fill:#ff9
    style Apply fill:#9cf
    style Verify fill:#9cf
    style Success fill:#9f9
    style NoChanges fill:#ccc
    style ValidationError fill:#f99
    style ApplicationError fill:#f99
```

### 3. Status Command

Shows the current state of schema synchronization:

```mermaid
graph TB
    Status[tento status] --> LoadBoth[Load local & remote schemas]
    LoadBoth --> Analysis[Analyze differences]
    
    Analysis --> LocalChanges[Local-only changes]
    Analysis --> RemoteChanges[Remote-only changes]
    Analysis --> Conflicts[Conflicting changes]
    Analysis --> InSync[Schemas in sync]
    
    LocalChanges --> Display[Display status]
    RemoteChanges --> Display
    Conflicts --> Display
    InSync --> Display
    
    Display --> Recommendations[Show recommendations]
    
    style Status fill:#ff9
    style LoadBoth fill:#9cf
    style Analysis fill:#ff9
    style LocalChanges fill:#ffc
    style RemoteChanges fill:#fcf
    style Conflicts fill:#f99
    style InSync fill:#9f9
    style Display fill:#9cf
    style Recommendations fill:#9cf
```

## Schema Processing Pipeline

### 1. Local Schema Reading

```mermaid
sequenceDiagram
    participant CLI as CLI Command
    participant Reader as Schema Reader
    participant Parser as TypeScript Parser
    participant Extractor as Metadata Extractor
    participant Validator as Schema Validator

    CLI->>Reader: Load schema file
    Reader->>Parser: Parse TypeScript
    Parser->>Extractor: Extract metaobjects
    Extractor->>Validator: Validate definitions
    Validator-->>Extractor: Validation results
    Extractor-->>Reader: Processed schema
    Reader-->>CLI: Schema definitions
```

### 2. Remote Schema Fetching

```mermaid
sequenceDiagram
    participant CLI as CLI Command
    participant Client as GraphQL Client
    participant API as Shopify Admin API
    participant Parser as Response Parser
    participant Mapper as Schema Mapper

    CLI->>Client: Fetch metaobject definitions
    Client->>API: GraphQL query
    API-->>Client: Raw response
    Client->>Parser: Parse GraphQL response
    Parser->>Mapper: Map to internal format
    Mapper-->>CLI: Schema definitions
```

### 3. Schema Comparison

```mermaid
graph TB
    subgraph "Schema Comparison Engine"
        LocalSchema[Local Schema]
        RemoteSchema[Remote Schema]
        Differ[Schema Differ]
        
        subgraph "Difference Types"
            Added[Added Metaobjects]
            Removed[Removed Metaobjects]
            Modified[Modified Metaobjects]
            FieldChanges[Field Changes]
        end
        
        subgraph "Field-level Changes"
            FieldAdded[Fields Added]
            FieldRemoved[Fields Removed]
            FieldModified[Fields Modified]
            ValidationChanged[Validations Changed]
        end
    end
    
    LocalSchema --> Differ
    RemoteSchema --> Differ
    
    Differ --> Added
    Differ --> Removed
    Differ --> Modified
    Differ --> FieldChanges
    
    FieldChanges --> FieldAdded
    FieldChanges --> FieldRemoved
    FieldChanges --> FieldModified
    FieldChanges --> ValidationChanged
    
    style LocalSchema fill:#e1e
    style RemoteSchema fill:#9f9
    style Differ fill:#ff9
    style Added fill:#9f9
    style Removed fill:#f99
    style Modified fill:#ffc
    style FieldChanges fill:#ff9
```

## Error Handling and User Experience

### 1. Error Classification

```mermaid
graph TB
    Errors[CLI Errors] --> Config[Configuration Errors]
    Errors --> Auth[Authentication Errors]
    Errors --> Network[Network Errors]
    Errors --> Schema[Schema Errors]
    Errors --> File[File System Errors]
    
    Config --> MissingConfig[Missing config file]
    Config --> InvalidConfig[Invalid configuration]
    Config --> MissingShop[Missing shop parameter]
    
    Auth --> InvalidToken[Invalid access token]
    Auth --> InsufficientPermissions[Insufficient permissions]
    Auth --> ExpiredToken[Expired token]
    
    Network --> ConnectionFailed[Connection failed]
    Network --> Timeout[Request timeout]
    Network --> RateLimit[Rate limit exceeded]
    
    Schema --> ParseError[Schema parse error]
    Schema --> ValidationError[Validation error]
    Schema --> ConflictError[Schema conflict]
    
    File --> FileNotFound[File not found]
    File --> PermissionDenied[Permission denied]
    File --> DiskFull[Disk full]
    
    style Errors fill:#f99
    style Config fill:#f99
    style Auth fill:#f99
    style Network fill:#f99
    style Schema fill:#f99
    style File fill:#f99
```

### 2. User Feedback System

```mermaid
sequenceDiagram
    participant Command as CLI Command
    participant Logger as Logger
    participant Progress as Progress Bar
    participant Formatter as Output Formatter
    participant Console as Console Output

    Note over Command, Console: Success Flow
    Command->>Progress: Start operation
    Command->>Logger: Log operation start
    Progress->>Console: Show progress bar
    Command->>Progress: Update progress
    Command->>Formatter: Format success message
    Formatter->>Console: Display success

    Note over Command, Console: Error Flow
    Command->>Logger: Log error details
    Command->>Formatter: Format error message
    Formatter->>Console: Display error
    Command->>Console: Show help/suggestions
```

## Configuration Management

### 1. Configuration Schema

```typescript
// tento.config.ts structure
interface TentoConfig {
  // Required: Shop identifier
  shop: string;
  
  // Required: Path to schema file
  schemaPath: string;
  
  // Required: Authentication headers
  headers: {
    'X-Shopify-Access-Token': string;
    [key: string]: string;
  };
  
  // Optional: API configuration
  api?: {
    version?: string;
    timeout?: number;
    retries?: number;
  };
  
  // Optional: CLI behavior
  cli?: {
    verbose?: boolean;
    autoConfirm?: boolean;
    outputFormat?: 'table' | 'json' | 'yaml';
  };
}
```

### 2. Environment Variable Support

```mermaid
graph LR
    subgraph "Environment Variables"
        SHOP[TENTO_SHOP]
        TOKEN[SHOPIFY_ADMIN_API_TOKEN]
        SCHEMA[TENTO_SCHEMA_PATH]
        VERBOSE[TENTO_VERBOSE]
        TIMEOUT[TENTO_TIMEOUT]
    end
    
    subgraph "Config Resolution"
        EnvLoader[Environment Loader]
        ConfigMerger[Config Merger]
        Validator[Config Validator]
    end
    
    SHOP --> EnvLoader
    TOKEN --> EnvLoader
    SCHEMA --> EnvLoader
    VERBOSE --> EnvLoader
    TIMEOUT --> EnvLoader
    
    EnvLoader --> ConfigMerger
    ConfigMerger --> Validator
    
    style EnvLoader fill:#9cf
    style ConfigMerger fill:#9cf
    style Validator fill:#ff9
```

## Output and Reporting

### 1. Output Formats

The CLI supports multiple output formats for different use cases:

```mermaid
graph TB
    Output[Command Output] --> Console[Console Display]
    Output --> JSON[JSON Format]
    Output --> YAML[YAML Format]
    Output --> Table[Table Format]
    
    Console --> Colors[Colored Text]
    Console --> Progress[Progress Indicators]
    Console --> Interactive[Interactive Prompts]
    
    JSON --> Structured[Structured Data]
    JSON --> MachineReadable[Machine Readable]
    
    YAML --> HumanReadable[Human Readable]
    YAML --> ConfigFiles[Config Files]
    
    Table --> Formatted[Formatted Columns]
    Table --> Sorting[Sortable Data]
    
    style Output fill:#9cf
    style Console fill:#ff9
    style JSON fill:#e1e
    style YAML fill:#e1e
    style Table fill:#e1e
```

### 2. Progress Reporting

```mermaid
sequenceDiagram
    participant CLI as CLI Command
    participant Progress as Progress Reporter
    participant Spinner as Spinner
    participant Bar as Progress Bar
    participant Console as Console

    CLI->>Progress: Start long operation
    Progress->>Spinner: Show spinner
    Spinner->>Console: Display animation
    
    CLI->>Progress: Report progress (30%)
    Progress->>Bar: Update progress bar
    Bar->>Console: Show 30% complete
    
    CLI->>Progress: Report progress (60%)
    Progress->>Bar: Update progress bar
    Bar->>Console: Show 60% complete
    
    CLI->>Progress: Complete operation
    Progress->>Console: Show completion message
```

## Testing Architecture

### 1. Test Structure

```mermaid
graph TB
    subgraph "Test Categories"
        Unit[Unit Tests]
        Integration[Integration Tests]
        E2E[End-to-End Tests]
        Mock[Mock Tests]
    end
    
    subgraph "Unit Tests"
        ConfigTests[Config Loading]
        SchemaTests[Schema Parsing]
        ValidationTests[Validation Logic]
        FormattingTests[Output Formatting]
    end
    
    subgraph "Integration Tests"
        APITests[API Integration]
        FileTests[File Operations]
        CLITests[CLI Commands]
    end
    
    subgraph "Mock Tests"
        ShopifyMock[Shopify API Mock]
        FileSystemMock[File System Mock]
        NetworkMock[Network Mock]
    end
    
    Unit --> ConfigTests
    Unit --> SchemaTests
    Unit --> ValidationTests
    Unit --> FormattingTests
    
    Integration --> APITests
    Integration --> FileTests
    Integration --> CLITests
    
    Mock --> ShopifyMock
    Mock --> FileSystemMock
    Mock --> NetworkMock
    
    style Unit fill:#9cf
    style Integration fill:#9cf
    style E2E fill:#9cf
    style Mock fill:#ff9
```

### 2. Test Execution Pipeline

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Test as Test Runner
    participant Mock as Mock Server
    participant CLI as CLI Command
    participant Assert as Assertions

    Dev->>Test: Run CLI tests
    Test->>Mock: Start mock Shopify API
    Test->>CLI: Execute CLI command
    CLI->>Mock: Make API requests
    Mock-->>CLI: Return mock responses
    CLI-->>Test: Command output
    Test->>Assert: Verify output
    Assert-->>Test: Test results
    Test-->>Dev: Test summary
```

## Performance Considerations

### 1. Command Execution Optimization

- **Lazy Loading**: Load heavy dependencies only when needed
- **Parallel Processing**: Execute independent operations concurrently
- **Caching**: Cache frequently accessed data like schema definitions
- **Streaming**: Process large datasets as streams rather than loading entirely into memory

### 2. Network Optimization

- **Request Batching**: Combine multiple API requests when possible
- **Compression**: Compress request/response payloads
- **Connection Reuse**: Maintain persistent connections for multiple requests
- **Retry Logic**: Implement exponential backoff for failed requests

### 3. Memory Management

- **Resource Cleanup**: Properly dispose of resources after use
- **Stream Processing**: Use streams for large file operations
- **Garbage Collection**: Minimize object creation in hot paths
- **Memory Monitoring**: Track memory usage for long-running operations