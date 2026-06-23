# Graph Report - PescaGo-Frontend  (2026-06-22)

## Corpus Check
- 72 files · ~82,547 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 323 nodes · 548 edges · 24 communities (9 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2b0a16d`
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
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `ApiService` - 47 edges
2. `AuthV2Service` - 25 edges
3. `FleetComponent` - 21 edges
4. `VehicleResource` - 15 edges
5. `ShippingInfoComponent` - 12 edges
6. `FleetV2Service` - 11 edges
7. `environment` - 11 edges
8. `HomeComponent` - 10 edges
9. `options` - 9 edges
10. `VehicleAvailabilityStatus` - 9 edges

## Surprising Connections (you probably didn't know these)
- `FleetComponent` --references--> `VehicleResource`  [EXTRACTED]
  src/app/domains/carrier/pages/fleet/fleet.component.ts → src/app/shared/models/fleet/vehicle-resource.model.ts
- `VehiclePayload` --references--> `VehicleAvailabilityStatus`  [EXTRACTED]
  src/app/shared/models/fleet/vehicle-payload.model.ts → src/app/shared/models/fleet/vehicle-availability-status.enum.ts
- `VehicleResource` --references--> `VehicleAvailabilityStatus`  [EXTRACTED]
  src/app/shared/models/fleet/vehicle-resource.model.ts → src/app/shared/models/fleet/vehicle-availability-status.enum.ts
- `VehiclePayload` --references--> `VehicleType`  [EXTRACTED]
  src/app/shared/models/fleet/vehicle-payload.model.ts → src/app/shared/models/fleet/vehicle-type.enum.ts
- `VehicleResource` --references--> `VehicleType`  [EXTRACTED]
  src/app/shared/models/fleet/vehicle-resource.model.ts → src/app/shared/models/fleet/vehicle-type.enum.ts

## Import Cycles
- None detected.

## Communities (24 total, 15 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (6): FleetComponent, VehicleAvailabilityStatus, VehiclePayload, VehicleResource, VehicleType, FleetV2Service

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (3): OfferedPriceComponent, PacketDetailsComponent, RequestsComponent

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (9): BusinessProfile, CanonicalRole, LoginProfile, LoginResponse, SessionProfile, AuthV2Service, environment, authV2Interceptor() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.36
Nodes (4): AppComponent, compiled, fixture, appConfig

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (7): routes, RouterHostComponent, authV2Guard(), carrierRoleGuard(), HomeComponent, SearchCarriersComponent, SignUpComponent

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (25): cli, analytics, newProjectRoot, prefix, projectType, root, schematics, sourceRoot (+17 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (24): dependencies, @angular/animations, @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/material (+16 more)

### Community 17 - "Community 17"
Cohesion: 0.07
Nodes (33): build, extract-i18n, serve, test, builder, configurations, defaultConfiguration, options (+25 more)

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (4): 1. Instalación de dependencias, 2. Ejecución, 3. Solución de problemas comunes, PescaGo Frontend

## Knowledge Gaps
- **71 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `schematics` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiService` connect `Community 0` to `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 18`, `Community 20`, `Community 21`, `Community 22`, `Community 23`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `FleetComponent` connect `Community 1` to `Community 8`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `AuthV2Service` connect `Community 4` to `Community 8`, `Community 22`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13229018492176386 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._