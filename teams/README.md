# Teams — FIFA World Cup 2026

Structure des 48 équipes qualifiées. Chaque dossier est nommé selon le code **ISO 3166-1 alpha-3** du pays.

## Structure d'un dossier équipe

```
teams/
  FRA/
    emblem      ← Image de l'emblème (PNG/JPG, min 1500×1500px, 150 DPI)
    file2       ← Design 2 (à renommer une fois le D1 validé)
    file3       ← Design 3
    file4       ← Design 4
```

## URL GitHub brute (pour l'API Printful)

```
https://raw.githubusercontent.com/{owner}/{repo}/main/teams/{ISO}/emblem.png
```

Exemple : `https://raw.githubusercontent.com/…/main/teams/FRA/emblem.png`

## Équipes par confédération

### CONCACAF (8) — dont 3 hôtes
`USA` `CAN` `MEX` `PAN` `JAM` `HND` `SLV` `CRC`

### CONMEBOL (6)
`ARG` `BRA` `COL` `URU` `ECU` `VEN`

### UEFA (16)
`FRA` `ESP` `ENG` `DEU` `PRT` `ITA` `NLD` `BEL`
`HRV` `CHE` `AUT` `TUR` `SRB` `POL` `DNK` `HUN`

### CAF (9)
`MAR` `SEN` `EGY` `NGA` `CMR` `CIV` `GHA` `TUN` `ALG`

### AFC (8)
`JPN` `KOR` `IRN` `AUS` `SAU` `IRQ` `JOR` `UZB`

### OFC (1)
`NZL`

## Notes
- Les fichiers `emblem`, `file2`, `file3`, `file4` sont des placeholders.
- Remplacer chaque placeholder par l'image correspondante (ex: `emblem.png`).
- Mettre à jour les références dans `src/lib/config/teams.ts` si l'extension change.
- Certaines qualifications intercontinentales peuvent modifier la liste — vérifier la liste officielle FIFA.
