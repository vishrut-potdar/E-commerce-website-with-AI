import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SpendPointsChartProps {
  currentPoints: number;
}

interface DataPoint {
  month: string;
  points: number;
}

export const SpendPointsChart: React.FC<SpendPointsChartProps> = ({ currentPoints }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

  // Generate last 12 months of points growth trend (scaled to current points)
  const generateData = (): DataPoint[] => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Growth multiplier curve to show dynamic growth over 12 months
    const growthCurve = [0.25, 0.30, 0.35, 0.38, 0.45, 0.52, 0.58, 0.68, 0.75, 0.85, 0.92, 1.0];
    
    const currentDate = new Date();
    const data: DataPoint[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthLabel = `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`;
      
      const multiplier = growthCurve[11 - i];
      const points = Math.round(currentPoints * multiplier);
      
      data.push({
        month: monthLabel,
        points: points
      });
    }

    return data;
  };

  const data = generateData();

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous elements
    d3.select(svgRef.current).selectAll('*').remove();

    // Define dimensions & margins
    const margin = { top: 15, right: 10, bottom: 25, left: 45 };
    const width = containerRef.current.clientWidth || 340;
    const height = 150;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color definitions
    const goldColor = '#C5A880';
    const darkSlate = '#1C1A17';

    // 1. Gradients
    const defs = svg.append('defs');

    // Smooth stroke gradient
    const strokeGradient = defs.append('linearGradient')
      .attr('id', 'gold-stroke-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    strokeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#AC8E62');
    
    strokeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#E8DDCD');

    // Smooth area fill gradient (fade to transparent)
    const areaGradient = defs.append('linearGradient')
      .attr('id', 'gold-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', goldColor)
      .attr('stop-opacity', 0.25);
    
    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', goldColor)
      .attr('stop-opacity', 0.0);

    // 2. Scales
    const xScale = d3.scalePoint<string>()
      .domain(data.map(d => d.month))
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.points) || currentPoints])
      .range([chartHeight, 0])
      .nice();

    // 3. Gridlines (Horizontal)
    const yAxisGrid = d3.axisLeft(yScale)
      .tickSize(-chartWidth)
      .tickFormat(() => '')
      .ticks(4);

    g.append('g')
      .attr('class', 'grid')
      .call(yAxisGrid)
      .selectAll('.tick line')
      .attr('stroke', '#E8DDCD')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,4')
      .attr('opacity', 0.6);

    g.selectAll('.grid .domain').remove();

    // 4. Axes (Custom Styled)
    const xAxis = d3.axisBottom(xScale)
      .tickValues(data.filter((_, i) => i % 3 === 0 || i === 11).map(d => d.month));

    const yAxis = d3.axisLeft(yScale)
      .ticks(4)
      .tickFormat(d => `₹${Number(d).toLocaleString('en-IN', { notation: 'compact' })}`);

    // Render X Axis
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-mono)')
      .attr('color', '#8E8880')
      .selectAll('.tick text')
      .attr('dy', '8px');

    g.select('g path.domain').attr('stroke', '#E8DDCD').attr('opacity', 0.5);
    g.selectAll('g.tick line').attr('stroke', '#E8DDCD').attr('opacity', 0.5);

    // Render Y Axis
    g.append('g')
      .call(yAxis)
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-mono)')
      .attr('color', '#8E8880');

    g.selectAll('g.tick line').attr('stroke', '#E8DDCD').attr('opacity', 0.5);

    // 5. Area path under the curve
    const areaGenerator = d3.area<DataPoint>()
      .x(d => xScale(d.month) || 0)
      .y0(chartHeight)
      .y1(d => yScale(d.points))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#gold-area-grad)')
      .attr('d', areaGenerator);

    // 6. Main line curve
    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.month) || 0)
      .y(d => yScale(d.points))
      .curve(d3.curveMonotoneX);

    const mainPath = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#gold-stroke-grad)')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    // Animate path drawing for dynamic premium feel
    const totalLength = (mainPath.node() as SVGPathElement).getTotalLength();
    mainPath
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // 7. Interactive overlay & vertical tracker line
    const trackerLine = g.append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', goldColor)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('style', 'display: none;');

    const focusCircle = g.append('circle')
      .attr('r', 5)
      .attr('fill', goldColor)
      .attr('stroke', '#FAF8F5')
      .attr('stroke-width', 1.5)
      .attr('style', 'display: none;');

    const outerPulseCircle = g.append('circle')
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', goldColor)
      .attr('stroke-width', 0.75)
      .attr('opacity', 0.4)
      .attr('style', 'display: none;');

    // Dummy overlay to capture hover events
    g.append('rect')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'transparent')
      .attr('style', 'cursor: crosshair;')
      .on('mousemove', (e) => {
        const [mouseX] = d3.pointer(e);
        
        // Find closest point based on mouseX
        let closestPoint = data[0];
        let minDiff = Infinity;
        
        data.forEach(d => {
          const xPos = xScale(d.month) || 0;
          const diff = Math.abs(xPos - mouseX);
          if (diff < minDiff) {
            minDiff = diff;
            closestPoint = d;
          }
        });

        const cx = xScale(closestPoint.month) || 0;
        const cy = yScale(closestPoint.points);

        trackerLine
          .attr('x1', cx)
          .attr('x2', cx)
          .attr('style', 'display: block;');

        focusCircle
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('style', 'display: block;');

        outerPulseCircle
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('style', 'display: block;');

        setHoveredData(closestPoint);
      })
      .on('mouseleave', () => {
        trackerLine.attr('style', 'display: none;');
        focusCircle.attr('style', 'display: none;');
        outerPulseCircle.attr('style', 'display: none;');
        setHoveredData(null);
      });

  }, [currentPoints, data]);

  return (
    <div ref={containerRef} className="w-full bg-[#FAF8F5]/85 p-3.5 border border-[#E8DDCD]/80 rounded-xl space-y-2.5 relative shadow-sm overflow-hidden select-none">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-widest font-bold text-[#A69988] block">Atelier Ledger</span>
          <span className="text-xs font-serif font-bold text-[#1C1A17]">12-Month Patron Contribution</span>
        </div>
        <div className="h-6 flex items-center">
          {hoveredData ? (
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-[#A69988] block leading-none">{hoveredData.month}</span>
              <span className="text-xs font-sans font-bold text-[#C5A880] leading-none">₹{hoveredData.points.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <span className="text-[9px] text-[#A69988] font-serif italic text-right">Hover details to audit ledger</span>
          )}
        </div>
      </div>

      <svg ref={svgRef} className="block w-full overflow-visible"></svg>
    </div>
  );
};
