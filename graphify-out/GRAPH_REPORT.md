# Graph Report - PescaGo-Frontend  (2026-06-21)

## Corpus Check
- 52 files · ~78,106 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 248 nodes · 341 edges · 20 communities (9 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9622921a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `ApiService` - 47 edges
2. `ShippingInfoComponent` - 12 edges
3. `HomeComponent` - 10 edges
4. `options` - 9 edges
5. `ConfirmedServicesComponent` - 8 edges
6. `PaymentGatewayComponent` - 8 edges
7. `pescago-frontend` - 7 edges
8. `PacketDetailsComponent` - 7 edges
9. `RequestsComponent` - 7 edges
10. `SearchCarriersComponent` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (20 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (4): HiredServicesComponent, ApiService, SignInComponent, HomeComponent

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (4): ConfirmedServicesComponent, PacketDetailsComponent, RequestsComponent, SignUpComponent

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (5): environment, User, UserCreate, RegisterCarrierComponent, HomeComponent

### Community 7 - "Community 7"
Cohesion: 0.31
Nodes (5): AppComponent, compiled, fixture, appConfig, routes

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (25): cli, analytics, newProjectRoot, prefix, projectType, root, schematics, sourceRoot (+17 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (24): dependencies, @angular/animations, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material (+16 more)

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (20): build, extract-i18n, serve, builder, configurations, defaultConfiguration, development, production (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.23
Nodes (12): test, options, assets, browser, index, outputPath, polyfills, scripts (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (4): 1. Instalación de dependencias, 2. Ejecución, 3. Solución de problemas comunes, PescaGo Frontend

## Knowledge Gaps
- **68 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `schematics` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiService` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 11`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 12` to `Community 13`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `pescago-frontend` connect `Community 12` to `Community 17`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._