# Error Handling and Validation Architecture

This document details the comprehensive error handling and validation system in Tento, covering error classification, recovery strategies, and validation patterns.

## Error Handling Overview

Tento implements a multi-layered error handling system that provides comprehensive error recovery, detailed error reporting, and robust validation at every stage of operation.

```mermaid
graph TB
    subgraph "Error Sources"
        UserError[User Input Errors]
        SystemError[System Errors]
        NetworkError[Network Errors]
        ValidationError[Validation Errors]
        BusinessError[Business Logic Errors]
    end
    
    subgraph "Error Processing"
        ErrorClassifier[Error Classifier]
        ErrorHandler[Error Handler]
        ErrorReporter[Error Reporter]
        ErrorLogger[Error Logger]
    end
    
    subgraph "Recovery Strategies"
        Retry[Retry Logic]
        Fallback[Fallback Mechanisms]
        Graceful[Graceful Degradation]
        UserFeedback[User Feedback]
    end
    
    UserError --> ErrorClassifier
    SystemError --> ErrorClassifier
    NetworkError --> ErrorClassifier
    ValidationError --> ErrorClassifier
    BusinessError --> ErrorClassifier
    
    ErrorClassifier --> ErrorHandler
    ErrorHandler --> ErrorReporter
    ErrorHandler --> ErrorLogger
    ErrorHandler --> Retry
    ErrorHandler --> Fallback
    ErrorHandler --> Graceful
    ErrorHandler --> UserFeedback
    
    style UserError fill:#ffc
    style SystemError fill:#f99
    style NetworkError fill:#f99
    style ValidationError fill:#ff9
    style BusinessError fill:#ffc
    style ErrorClassifier fill:#9cf
    style ErrorHandler fill:#9cf
    style ErrorReporter fill:#9cf
    style ErrorLogger fill:#9cf
    style Retry fill:#9cf
    style Fallback fill:#9cf
    style Graceful fill:#9cf
    style UserFeedback fill:#ff9
```

## Error Classification System

### 1. Error Hierarchy

```mermaid
classDiagram
    class TentoError {
        <<abstract>>
        +code: string
        +message: string
        +details: ErrorDetails
        +timestamp: Date
        +stack: string
        +isRetryable(): boolean
        +getRecoveryStrategy(): RecoveryStrategy
    }
    
    class ValidationError {
        +field: string
        +constraint: string
        +actualValue: any
        +expectedFormat: string
    }
    
    class NetworkError {
        +statusCode: number
        +responseBody: string
        +headers: Record<string, string>
        +timeout: boolean
    }
    
    class AuthenticationError {
        +authMethod: string
        +reason: string
        +canRetry: boolean
    }
    
    class BusinessLogicError {
        +operation: string
        +context: Record<string, any>
        +suggestions: string[]
    }
    
    class SystemError {
        +component: string
        +severity: ErrorSeverity
        +impact: string[]
    }
    
    TentoError <|-- ValidationError
    TentoError <|-- NetworkError
    TentoError <|-- AuthenticationError
    TentoError <|-- BusinessLogicError
    TentoError <|-- SystemError
```

### 2. Error Severity Levels

```mermaid
graph TB
    subgraph "Severity Levels"
        Critical[Critical Errors]
        Error[Error Level]
        Warning[Warning Level]
        Info[Information Level]
        Debug[Debug Level]
    end
    
    subgraph "Response Actions"
        Immediate[Immediate Response]
        Escalation[Error Escalation]
        Logging[Enhanced Logging]
        Monitoring[System Monitoring]
        Debugging[Debug Information]
    end
    
    subgraph "Notification Channels"
        Alerts[System Alerts]
        Email[Email Notifications]
        Dashboard[Dashboard Updates]
        Logs[Log Files]
        Metrics[Metrics Collection]
    end
    
    Critical --> Immediate
    Error --> Escalation
    Warning --> Logging
    Info --> Monitoring
    Debug --> Debugging
    
    Immediate --> Alerts
    Escalation --> Email
    Logging --> Dashboard
    Monitoring --> Logs
    Debugging --> Metrics
    
    style Critical fill:#f99
    style Error fill:#ffc
    style Warning fill:#ff9
    style Info fill:#9f9
    style Debug fill:#ccc
    style Immediate fill:#f99
    style Escalation fill:#ffc
    style Alerts fill:#f99
    style Email fill:#ffc
```

## Validation System Architecture

### 1. Multi-level Validation

```mermaid
sequenceDiagram
    participant Input as User Input
    participant Syntax as Syntax Validator
    participant Type as Type Validator
    participant Business as Business Validator
    participant Remote as Remote Validator
    participant Result as Validation Result

    Input->>Syntax: Validate syntax
    
    alt Syntax valid
        Syntax->>Type: Validate types
        alt Types valid
            Type->>Business: Validate business rules
            alt Business rules valid
                Business->>Remote: Validate with Shopify
                alt Remote validation passes
                    Remote->>Result: Validation successful
                else Remote validation fails
                    Remote->>Result: Remote validation errors
                end
            else Business rules invalid
                Business->>Result: Business rule violations
            end
        else Types invalid
            Type->>Result: Type validation errors
        end
    else Syntax invalid
        Syntax->>Result: Syntax errors
    end
```

### 2. Validation Rule Engine

```mermaid
graph TB
    subgraph "Validation Rules"
        Required[Required Fields]
        Types[Type Constraints]
        Format[Format Validation]
        Range[Range Validation]
        Pattern[Pattern Matching]
        Custom[Custom Validators]
        Dependencies[Dependency Rules]
        BusinessRules[Business Rules]
    end
    
    subgraph "Rule Processing"
        RuleEngine[Rule Engine]
        RuleComposer[Rule Composer]
        ContextProvider[Context Provider]
        ResultAggregator[Result Aggregator]
    end
    
    subgraph "Validation Context"
        FieldContext[Field Context]
        SchemaContext[Schema Context]
        OperationContext[Operation Context]
        UserContext[User Context]
    end
    
    Required --> RuleEngine
    Types --> RuleEngine
    Format --> RuleComposer
    Range --> RuleComposer
    Pattern --> RuleComposer
    Custom --> RuleComposer
    Dependencies --> ContextProvider
    BusinessRules --> ContextProvider
    
    RuleEngine --> FieldContext
    RuleComposer --> SchemaContext
    ContextProvider --> OperationContext
    ResultAggregator --> UserContext
    
    style Required fill:#ff9
    style Types fill:#ff9
    style Format fill:#ff9
    style Range fill:#ff9
    style Pattern fill:#ff9
    style Custom fill:#9cf
    style Dependencies fill:#9cf
    style BusinessRules fill:#9cf
    style RuleEngine fill:#9cf
    style RuleComposer fill:#9cf
    style ContextProvider fill:#9cf
    style ResultAggregator fill:#9cf
```

## Error Recovery Strategies

### 1. Retry Mechanisms

```mermaid
flowchart TD
    Error[Error Occurs] --> Classification[Classify Error]
    
    Classification --> Retryable{Retryable?}
    
    Retryable -->|Yes| RetryStrategy[Select Retry Strategy]
    Retryable -->|No| FallbackStrategy[Select Fallback Strategy]
    
    RetryStrategy --> ExponentialBackoff[Exponential Backoff]
    RetryStrategy --> LinearBackoff[Linear Backoff]
    RetryStrategy --> ConstantDelay[Constant Delay]
    RetryStrategy --> CircuitBreaker[Circuit Breaker]
    
    ExponentialBackoff --> AttemptRetry[Attempt Retry]
    LinearBackoff --> AttemptRetry
    ConstantDelay --> AttemptRetry
    CircuitBreaker --> AttemptRetry
    
    AttemptRetry --> Success{Success?}
    
    Success -->|Yes| Recovery[Recovery Complete]
    Success -->|No| MaxRetries{Max Retries?}
    
    MaxRetries -->|Reached| FallbackStrategy
    MaxRetries -->|Not Reached| RetryStrategy
    
    FallbackStrategy --> CachedData[Use Cached Data]
    FallbackStrategy --> DefaultValues[Use Default Values]
    FallbackStrategy --> AlternateAPI[Use Alternate API]
    FallbackStrategy --> GracefulDegradation[Graceful Degradation]
    
    style Error fill:#f99
    style Classification fill:#ff9
    style RetryStrategy fill:#9cf
    style FallbackStrategy fill:#9cf
    style Recovery fill:#9f9
    style GracefulDegradation fill:#9cf
```

### 2. Circuit Breaker Pattern

```mermaid
stateDiagram-v2
    [*] --> Closed
    
    Closed --> Open : Failure threshold exceeded
    Open --> HalfOpen : Timeout elapsed
    HalfOpen --> Closed : Success
    HalfOpen --> Open : Failure
    
    state Closed {
        [*] --> Normal
        Normal --> FailureCount : Request fails
        FailureCount --> Normal : Request succeeds
        FailureCount --> ThresholdReached : Too many failures
        ThresholdReached --> [*]
    }
    
    state Open {
        [*] --> Blocking
        Blocking --> Timer : Start timeout
        Timer --> [*] : Timeout elapsed
    }
    
    state HalfOpen {
        [*] --> TestRequest
        TestRequest --> Success : Request succeeds
        TestRequest --> Failure : Request fails
        Success --> [*]
        Failure --> [*]
    }
```

## Validation Patterns

### 1. Field-level Validation

```mermaid
graph TB
    subgraph "String Validation"
        StringField[String Field]
        MinLength[Minimum Length]
        MaxLength[Maximum Length]
        Pattern[Regex Pattern]
        Enum[Enumeration]
        NotEmpty[Not Empty]
    end
    
    subgraph "Numeric Validation"
        NumericField[Numeric Field]
        MinValue[Minimum Value]
        MaxValue[Maximum Value]
        Precision[Decimal Precision]
        Integer[Integer Only]
        Positive[Positive Numbers]
    end
    
    subgraph "Date Validation"
        DateField[Date Field]
        MinDate[Minimum Date]
        MaxDate[Maximum Date]
        DateFormat[Date Format]
        BusinessDays[Business Days Only]
        FutureOnly[Future Dates Only]
    end
    
    subgraph "Reference Validation"
        ReferenceField[Reference Field]
        EntityExists[Entity Exists]
        ValidReference[Valid Reference]
        AccessControl[Access Control]
        RelationshipRules[Relationship Rules]
    end
    
    StringField --> MinLength
    StringField --> MaxLength
    StringField --> Pattern
    StringField --> Enum
    StringField --> NotEmpty
    
    NumericField --> MinValue
    NumericField --> MaxValue
    NumericField --> Precision
    NumericField --> Integer
    NumericField --> Positive
    
    DateField --> MinDate
    DateField --> MaxDate
    DateField --> DateFormat
    DateField --> BusinessDays
    DateField --> FutureOnly
    
    ReferenceField --> EntityExists
    ReferenceField --> ValidReference
    ReferenceField --> AccessControl
    ReferenceField --> RelationshipRules
    
    style StringField fill:#9cf
    style NumericField fill:#9cf
    style DateField fill:#9cf
    style ReferenceField fill:#9cf
```

### 2. Schema-level Validation

```mermaid
sequenceDiagram
    participant Schema as Schema Definition
    participant Structure as Structure Validator
    participant Dependency as Dependency Validator
    participant Consistency as Consistency Validator
    participant Business as Business Rule Validator
    participant Result as Validation Result

    Schema->>Structure: Validate structure
    Structure->>Dependency: Check dependencies
    Dependency->>Consistency: Verify consistency
    Consistency->>Business: Apply business rules
    Business->>Result: Compile results
    
    Note over Structure: Field definitions, types
    Note over Dependency: Required fields, relationships
    Note over Consistency: Cross-field validation
    Note over Business: Domain-specific rules
```

## Error Reporting and Logging

### 1. Error Reporting System

```mermaid
graph TB
    subgraph "Error Sources"
        ClientErrors[Client Errors]
        ServerErrors[Server Errors]
        ValidationErrors[Validation Errors]
        BusinessErrors[Business Errors]
    end
    
    subgraph "Reporting Pipeline"
        ErrorCapture[Error Capture]
        ErrorEnrichment[Error Enrichment]
        ErrorFormatting[Error Formatting]
        ErrorDistribution[Error Distribution]
    end
    
    subgraph "Output Channels"
        ConsoleOutput[Console Output]
        LogFiles[Log Files]
        ErrorTracking[Error Tracking Service]
        Metrics[Metrics System]
        Notifications[Notifications]
    end
    
    ClientErrors --> ErrorCapture
    ServerErrors --> ErrorCapture
    ValidationErrors --> ErrorCapture
    BusinessErrors --> ErrorCapture
    
    ErrorCapture --> ErrorEnrichment
    ErrorEnrichment --> ErrorFormatting
    ErrorFormatting --> ErrorDistribution
    
    ErrorDistribution --> ConsoleOutput
    ErrorDistribution --> LogFiles
    ErrorDistribution --> ErrorTracking
    ErrorDistribution --> Metrics
    ErrorDistribution --> Notifications
    
    style ClientErrors fill:#ffc
    style ServerErrors fill:#f99
    style ValidationErrors fill:#ff9
    style BusinessErrors fill:#ffc
    style ErrorCapture fill:#9cf
    style ErrorEnrichment fill:#9cf
    style ErrorFormatting fill:#9cf
    style ErrorDistribution fill:#9cf
```

### 2. Structured Logging

```mermaid
graph LR
    subgraph "Log Structure"
        Timestamp[Timestamp]
        Level[Log Level]
        Component[Component]
        Operation[Operation]
        Error[Error Details]
        Context[Context Data]
        TraceID[Trace ID]
        UserID[User ID]
    end
    
    subgraph "Log Enrichment"
        StackTrace[Stack Trace]
        RequestInfo[Request Info]
        SessionData[Session Data]
        EnvironmentInfo[Environment Info]
        PerformanceMetrics[Performance Metrics]
    end
    
    subgraph "Log Processing"
        Parsing[Log Parsing]
        Indexing[Log Indexing]
        Searching[Log Searching]
        Alerting[Alert Generation]
        Analytics[Log Analytics]
    end
    
    Timestamp --> StackTrace
    Level --> RequestInfo
    Component --> SessionData
    Operation --> EnvironmentInfo
    Error --> PerformanceMetrics
    Context --> StackTrace
    TraceID --> RequestInfo
    UserID --> SessionData
    
    StackTrace --> Parsing
    RequestInfo --> Indexing
    SessionData --> Searching
    EnvironmentInfo --> Alerting
    PerformanceMetrics --> Analytics
    
    style Timestamp fill:#e1e
    style Level fill:#e1e
    style Component fill:#e1e
    style Operation fill:#e1e
    style Error fill:#e1e
    style Context fill:#e1e
    style TraceID fill:#e1e
    style UserID fill:#e1e
    style Parsing fill:#9cf
    style Indexing fill:#9cf
    style Searching fill:#9cf
    style Alerting fill:#ff9
    style Analytics fill:#9cf
```

## User Experience and Error Handling

### 1. User-Friendly Error Messages

```mermaid
flowchart TD
    TechnicalError[Technical Error] --> ErrorAnalyzer[Error Analyzer]
    
    ErrorAnalyzer --> UserImpact[Analyze User Impact]
    ErrorAnalyzer --> ErrorCause[Determine Root Cause]
    ErrorAnalyzer --> RecoveryOptions[Identify Recovery Options]
    
    UserImpact --> MessageComposer[Message Composer]
    ErrorCause --> MessageComposer
    RecoveryOptions --> MessageComposer
    
    MessageComposer --> PlainLanguage[Plain Language Description]
    MessageComposer --> ActionableSteps[Actionable Steps]
    MessageComposer --> HelpResources[Help Resources]
    MessageComposer --> ContactInfo[Contact Information]
    
    PlainLanguage --> UserMessage[User-Friendly Message]
    ActionableSteps --> UserMessage
    HelpResources --> UserMessage
    ContactInfo --> UserMessage
    
    style TechnicalError fill:#f99
    style ErrorAnalyzer fill:#9cf
    style MessageComposer fill:#9cf
    style UserMessage fill:#9f9
    style PlainLanguage fill:#ff9
    style ActionableSteps fill:#ff9
    style HelpResources fill:#ff9
    style ContactInfo fill:#ff9
```

### 2. Progressive Error Disclosure

```mermaid
graph TB
    subgraph "Error Disclosure Levels"
        Basic[Basic Error Message]
        Detailed[Detailed Information]
        Technical[Technical Details]
        Debug[Debug Information]
    end
    
    subgraph "User Types"
        EndUser[End User]
        Developer[Developer]
        Administrator[Administrator]
        Support[Support Team]
    end
    
    subgraph "Disclosure Rules"
        UserLevel[User Level Based]
        ErrorSeverity[Error Severity Based]
        ContextSensitive[Context Sensitive]
        ConfigurableDetail[Configurable Detail]
    end
    
    Basic --> EndUser
    Detailed --> Developer
    Technical --> Administrator
    Debug --> Support
    
    EndUser --> UserLevel
    Developer --> ErrorSeverity
    Administrator --> ContextSensitive
    Support --> ConfigurableDetail
    
    style Basic fill:#9f9
    style Detailed fill:#ff9
    style Technical fill:#ffc
    style Debug fill:#f99
    style EndUser fill:#9cf
    style Developer fill:#9cf
    style Administrator fill:#9cf
    style Support fill:#9cf
```

## Performance Impact of Error Handling

### 1. Error Handling Performance

```mermaid
graph LR
    subgraph "Performance Considerations"
        ExceptionCost[Exception Overhead]
        ValidationCost[Validation Overhead]
        LoggingCost[Logging Overhead]
        RecoveryCost[Recovery Overhead]
    end
    
    subgraph "Optimization Strategies"
        EarlyValidation[Early Validation]
        FastPath[Fast Path for Common Cases]
        LazyLogging[Lazy Logging]
        PooledObjects[Pooled Error Objects]
    end
    
    subgraph "Performance Metrics"
        Latency[Error Handling Latency]
        Throughput[Error Throughput]
        MemoryUsage[Memory Usage]
        CPUUsage[CPU Usage]
    end
    
    ExceptionCost --> EarlyValidation
    ValidationCost --> FastPath
    LoggingCost --> LazyLogging
    RecoveryCost --> PooledObjects
    
    EarlyValidation --> Latency
    FastPath --> Throughput
    LazyLogging --> MemoryUsage
    PooledObjects --> CPUUsage
    
    style ExceptionCost fill:#ffc
    style ValidationCost fill:#ffc
    style LoggingCost fill:#ffc
    style RecoveryCost fill:#ffc
    style EarlyValidation fill:#9cf
    style FastPath fill:#9cf
    style LazyLogging fill:#9cf
    style PooledObjects fill:#9cf
    style Latency fill:#9f9
    style Throughput fill:#9f9
    style MemoryUsage fill:#9f9
    style CPUUsage fill:#9f9
```

### 2. Error Budget Management

```mermaid
sequenceDiagram
    participant System as System Component
    participant Budget as Error Budget
    participant Monitor as Error Monitor
    participant Alert as Alert System
    participant Response as Response Team

    System->>Budget: Error occurs
    Budget->>Budget: Update error count
    Budget->>Monitor: Check budget status
    
    alt Budget healthy
        Monitor->>System: Continue normal operation
    else Budget warning
        Monitor->>Alert: Send warning alert
        Alert->>Response: Notify on-call team
    else Budget exhausted
        Monitor->>System: Trigger circuit breaker
        Monitor->>Alert: Send critical alert
        Alert->>Response: Escalate to leadership
    end
    
    Note over Budget: Tracks error rate vs SLA
    Note over Monitor: Real-time monitoring
    Note over Response: Incident response
```

## Testing Error Handling

### 1. Error Testing Strategy

```mermaid
graph TB
    subgraph "Test Categories"
        UnitTests[Unit Tests]
        IntegrationTests[Integration Tests]
        EndToEndTests[End-to-End Tests]
        ChaosTests[Chaos Tests]
    end
    
    subgraph "Error Scenarios"
        InvalidInput[Invalid Input]
        NetworkFailures[Network Failures]
        AuthFailures[Auth Failures]
        ResourceExhaustion[Resource Exhaustion]
        ConcurrencyIssues[Concurrency Issues]
    end
    
    subgraph "Testing Tools"
        MockFramework[Mock Framework]
        FaultInjection[Fault Injection]
        LoadTesting[Load Testing]
        MonkeyTesting[Monkey Testing]
    end
    
    UnitTests --> InvalidInput
    IntegrationTests --> NetworkFailures
    EndToEndTests --> AuthFailures
    ChaosTests --> ResourceExhaustion
    ChaosTests --> ConcurrencyIssues
    
    InvalidInput --> MockFramework
    NetworkFailures --> FaultInjection
    AuthFailures --> LoadTesting
    ResourceExhaustion --> MonkeyTesting
    ConcurrencyIssues --> FaultInjection
    
    style UnitTests fill:#9cf
    style IntegrationTests fill:#9cf
    style EndToEndTests fill:#9cf
    style ChaosTests fill:#ff9
    style InvalidInput fill:#ffc
    style NetworkFailures fill:#f99
    style AuthFailures fill:#ffc
    style ResourceExhaustion fill:#f99
    style ConcurrencyIssues fill:#f99
```

### 2. Automated Error Testing

```mermaid
sequenceDiagram
    participant CI as CI Pipeline
    participant ErrorTests as Error Test Suite
    participant MockServices as Mock Services
    participant TestReporter as Test Reporter
    participant AlertSystem as Alert System

    CI->>ErrorTests: Run error tests
    ErrorTests->>MockServices: Setup error scenarios
    MockServices->>ErrorTests: Simulate failures
    ErrorTests->>TestReporter: Report test results
    
    alt Tests pass
        TestReporter->>CI: All error handling works
    else Tests fail
        TestReporter->>AlertSystem: Error handling issues detected
        AlertSystem->>CI: Block deployment
    end
    
    Note over MockServices: Simulates various failure modes
    Note over TestReporter: Detailed error analysis
    Note over AlertSystem: Prevents faulty deployments
```

## Monitoring and Alerting

### 1. Error Monitoring Architecture

```mermaid
graph TB
    subgraph "Data Collection"
        ErrorEvents[Error Events]
        MetricsCollection[Metrics Collection]
        LogAggregation[Log Aggregation]
        TraceCollection[Trace Collection]
    end
    
    subgraph "Processing"
        RealTimeProcessing[Real-time Processing]
        BatchProcessing[Batch Processing]
        AnomalyDetection[Anomaly Detection]
        TrendAnalysis[Trend Analysis]
    end
    
    subgraph "Alerting"
        ThresholdAlerts[Threshold Alerts]
        AnomalyAlerts[Anomaly Alerts]
        TrendAlerts[Trend Alerts]
        CompoundAlerts[Compound Alerts]
    end
    
    ErrorEvents --> RealTimeProcessing
    MetricsCollection --> BatchProcessing
    LogAggregation --> AnomalyDetection
    TraceCollection --> TrendAnalysis
    
    RealTimeProcessing --> ThresholdAlerts
    BatchProcessing --> AnomalyAlerts
    AnomalyDetection --> TrendAlerts
    TrendAnalysis --> CompoundAlerts
    
    style ErrorEvents fill:#f99
    style MetricsCollection fill:#9cf
    style LogAggregation fill:#9cf
    style TraceCollection fill:#9cf
    style RealTimeProcessing fill:#ff9
    style BatchProcessing fill:#9cf
    style AnomalyDetection fill:#ff9
    style TrendAnalysis fill:#9cf
    style ThresholdAlerts fill:#ffc
    style AnomalyAlerts fill:#ff9
    style TrendAlerts fill:#ff9
    style CompoundAlerts fill:#f99
```

### 2. Incident Response Workflow

```mermaid
flowchart TD
    Alert[Alert Triggered] --> Triage[Alert Triage]
    
    Triage --> Severity{Assess Severity}
    
    Severity -->|P0 Critical| Immediate[Immediate Response]
    Severity -->|P1 High| Urgent[Urgent Response]
    Severity -->|P2 Medium| Standard[Standard Response]
    Severity -->|P3 Low| Scheduled[Scheduled Response]
    
    Immediate --> Escalate[Escalate to On-call]
    Urgent --> Assign[Assign to Team]
    Standard --> Queue[Add to Queue]
    Scheduled --> Backlog[Add to Backlog]
    
    Escalate --> Investigate[Investigate Issue]
    Assign --> Investigate
    Queue --> Investigate
    Backlog --> Investigate
    
    Investigate --> Resolve[Resolve Issue]
    Resolve --> Verify[Verify Resolution]
    Verify --> PostMortem[Post-mortem Analysis]
    PostMortem --> Improve[Process Improvement]
    
    style Alert fill:#f99
    style Immediate fill:#f99
    style Urgent fill:#ffc
    style Standard fill:#ff9
    style Scheduled fill:#9f9
    style Investigate fill:#9cf
    style Resolve fill:#9cf
    style Verify fill:#9cf
    style PostMortem fill:#9cf
    style Improve fill:#9f9
```