# Teams — FIFA World Cup 2026

Structure des 48 équipes qualifiées. Chaque dossier porte le code **ISO 3166-1 alpha-2** du pays (2 caractères).

## Structure d'un dossier équipe

```
teams/
  FR/
    emblem/       ← déposer ici : emblem_FR.png
    file2/        ← design 2 (renommer plus tard)
    file3/        ← design 3
    file4/        ← design 4
```

## Convention de nommage des fichiers

| Dossier   | Fichier attendu        | Exemple          |
|-----------|------------------------|------------------|
| `emblem/` | `emblem_{ISO}.png`     | `emblem_FR.png`  |
| `file2/`  | à définir              | —                |
| `file3/`  | à définir              | —                |
| `file4/`  | à définir              | —                |

## URL GitHub brute (pour l'API Printful)

```
https://raw.githubusercontent.com/Maruuch/MONDIAL26/main/teams/{ISO}/emblem/emblem_{ISO}.png
```

Exemple : `.../teams/FR/emblem/emblem_FR.png`

## Équipes par confédération

### CONCACAF (8) — dont 3 hôtes
`US` `CA` `MX` `PA` `JM` `HN` `SV` `CR`

### CONMEBOL (6)
`AR` `BR` `CO` `UY` `EC` `VE`

### UEFA (16)
`FR` `ES` `EN` `DE` `PT` `IT` `NL` `BE`
`HR` `CH` `AT` `TR` `RS` `PL` `DK` `HU`

### CAF (9)
`MA` `SN` `EG` `NG` `CM` `CI` `GH` `TN` `DZ`

### AFC (8)
`JP` `KR` `IR` `AU` `SA` `IQ` `JO` `UZ`

### OFC (1)
`NZ`
