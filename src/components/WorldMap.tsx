"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTeamByMapId, type CountryData } from "@/lib/utils/countries";

interface TooltipState {
  name: string;
  group: string;
  flag: string;
  slug: string;
  x: number;
  y: number;
  primary: string;
}

// Cache module-level du TopoJSON
let worldCache: unknown = null;

export function WorldMap() {
  const svgRef       = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router       = useRouter();
  const [tooltip, setTooltip]   = useState<TooltipState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const drawMap = useCallback(async () => {
    if (!svgRef.current || !containerRef.current) return;

    try {
      // Chargement D3 + TopoJSON + données monde
      const [d3, topojson] = await Promise.all([
        import("d3"),
        import("topojson-client"),
      ]);

      if (!worldCache) {
        worldCache = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        ).then((r) => r.json());
      }

      const world = worldCache as {
        objects: { countries: TopoJSON.Objects };
        [k: string]: unknown;
      };

      if (!svgRef.current || !containerRef.current) return;

      const W = containerRef.current.clientWidth || 900;
      const H = Math.round(W * 0.52);

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      svgRef.current.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svgRef.current.setAttribute("width",  String(W));
      svgRef.current.setAttribute("height", String(H));

      // Filtre glow
      const defs   = svg.append("defs");
      const filter = defs.append("filter").attr("id", "wc-glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
      filter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "blur");
      const merge = filter.append("feMerge");
      merge.append("feMergeNode").attr("in", "blur");
      merge.append("feMergeNode").attr("in", "SourceGraphic");

      // Projection Natural Earth
      const projection = d3.geoNaturalEarth1()
        .scale(W / 6.4)
        .translate([W / 2, H / 2]);

      const pathGen = d3.geoPath().projection(projection);

      // Sphère de fond
      svg.append("path")
        .datum({ type: "Sphere" } as d3.GeoPermissibleObjects)
        .attr("d", pathGen)
        .attr("fill", "#060D1C")
        .attr("stroke", "none");

      // Graticule
      const graticule = d3.geoGraticule();
      svg.append("path")
        .datum(graticule())
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#152038")
        .attr("stroke-width", 0.4);

      // Pays
      const { feature }  = topojson;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries    = feature(world as any, world.objects.countries as any) as unknown as d3.ExtendedFeatureCollection;
      const countryPaths = svg.append("g").attr("class", "countries");

      countryPaths
        .selectAll<SVGPathElement, d3.ExtendedFeature>("path.country")
        .data(countries.features)
        .join("path")
        .attr("class", (d) => {
          const team = getTeamByMapId(+(d.id ?? -1));
          return `country${team ? " qualified" : ""}`;
        })
        .attr("d", pathGen)
        .attr("fill", (d) => {
          const team = getTeamByMapId(+(d.id ?? -1));
          return team ? team.colors.primary + "28" : "#0E1C30";
        })
        .attr("stroke", "#0A1628")
        .attr("stroke-width", 0.4)
        .on("mouseenter", function (event: MouseEvent, d: d3.ExtendedFeature) {
          const team = getTeamByMapId(+(d.id ?? -1));
          if (!team) return;

          d3.select(this)
            .raise()
            .transition()
            .duration(180)
            .attr("fill", team.colors.primary)
            .attr("stroke", team.colors.secondary || "#fff")
            .attr("stroke-width", 0.8)
            .attr("filter", "url(#wc-glow)");

          const rect = svgRef.current!.getBoundingClientRect();
          setTooltip({
            name:    team.name,
            group:   team.group,
            flag:    team.flag,
            slug:    team.slug,
            x:       event.clientX - rect.left,
            y:       event.clientY - rect.top,
            primary: team.colors.primary,
          });
        })
        .on("mousemove", function (event: MouseEvent) {
          const rect = svgRef.current!.getBoundingClientRect();
          setTooltip((prev) =>
            prev
              ? { ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top }
              : prev
          );
        })
        .on("mouseleave", function (event: MouseEvent, d: d3.ExtendedFeature) {
          const team = getTeamByMapId(+(d.id ?? -1));
          if (!team) return;

          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", team.colors.primary + "28")
            .attr("stroke", "#0A1628")
            .attr("stroke-width", 0.4)
            .attr("filter", null);

          setTooltip(null);
        })
        .on("click", function (event: MouseEvent, d: d3.ExtendedFeature) {
          const team = getTeamByMapId(+(d.id ?? -1));
          if (!team) return;
          router.push(`/teams/${team.slug}`);
        });

      setIsLoaded(true);
    } catch (err) {
      console.error("[WorldMap]", err);
      setLoadError(true);
    }
  }, [router]);

  useEffect(() => {
    drawMap();

    let resizeTimer: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsLoaded(false);
        drawMap();
      }, 300);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [drawMap]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "#060D1C",
        border: "1px solid rgba(30,45,74,0.8)",
        minHeight: 280,
      }}
    >
      {/* Loading state */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-wc-accent border-t-transparent"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <span className="text-wc-muted text-sm">Chargement de la carte…</span>
        </div>
      )}

      {/* Erreur */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center">
          <span className="text-3xl">🗺️</span>
          <p className="text-wc-muted text-sm">
            La carte n&apos;a pas pu se charger. Vérifiez votre connexion.
          </p>
        </div>
      )}

      {/* SVG */}
      <svg
        ref={svgRef}
        className="world-map-svg w-full block"
        style={{ display: isLoaded ? "block" : "none" }}
      />

      {/* Tooltip */}
      {tooltip && isLoaded && (
        <div
          className="map-tooltip"
          style={{
            left: tooltip.x,
            top:  tooltip.y,
            borderColor: tooltip.primary + "60",
          }}
        >
          <span className="mr-1.5 text-base">{tooltip.flag}</span>
          <span className="text-wc-text">{tooltip.name}</span>
          <span
            className="ml-2 text-xs font-black"
            style={{ color: "#E8C547" }}
          >
            Gr. {tooltip.group}
          </span>
        </div>
      )}

      {/* Légende */}
      {isLoaded && (
        <div
          className="absolute bottom-3 left-3 flex items-center gap-3 text-xs"
          style={{ color: "rgba(100,116,139,0.8)" }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: "rgba(232,197,71,0.3)", border: "1px solid rgba(232,197,71,0.5)" }}
            />
            Qualifié
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: "#0E1C30", border: "1px solid #152038" }} />
            Non qualifié
          </span>
        </div>
      )}

      {/* Spin keyframe inline */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
