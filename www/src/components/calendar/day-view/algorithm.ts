import { ICalendarEvent } from '../utils/types';

type EventInfo = {
  event: ICalendarEvent,
  start: Date,
  end: Date,
};

type RenderInfo = {
  event: ICalendarEvent,
  start: Date,
  end: Date,
  colIdx: number,
  colCount: number,
  fullColCount: number,
}[];

function getEventWidth(target: EventInfo, nextCol: number, curGrid: EventInfo[][]): number {
  let width = 1;
  for (let colI = nextCol; colI < curGrid.length; colI += 1) {
    for (let rowI = 0; rowI < curGrid[colI].length; rowI += 1) {
      const tester = curGrid[colI][rowI];
      if (target.start < tester.end && tester.start < target.end) {
        // Collision found
        return width;
      }
    }
    width += 1;
  }
  return width;
}

export function getRenderInfo(partDayEventsInfo: EventInfo[]): RenderInfo {
  let lastEndTime: Date | null = null;
  let grid: EventInfo[][] = [];
  const renderInfo: RenderInfo = [];
  const addRenderInfo = (curGrid: EventInfo[][]) => {
    for (let colI = 0; colI < curGrid.length; colI += 1) {
      for (let rowI = 0; rowI < curGrid[colI].length; rowI += 1) {
        const target = curGrid[colI][rowI];
        renderInfo.push({
          event: target.event,
          start: target.start,
          end: target.end,
          colIdx: colI,
          colCount: getEventWidth(target, colI + 1, curGrid),
          fullColCount: curGrid.length,
        });
      }
    }
  };
  // Place events as left as possible
  for (let i = 0; i < partDayEventsInfo.length; i += 1) {
    const cur = partDayEventsInfo[i];
    if (lastEndTime !== null && lastEndTime <= cur.start) {
      // New colliding group starts. Add render info from previous one
      addRenderInfo(grid);
      grid = [];
      lastEndTime = null;
    }
    let found = false;
    for (let col = 0; col < grid.length; col += 1) {
      if (grid[col][grid[col].length - 1].end <= cur.start) {
        grid[col].push(cur);
        found = true;
        break;
      }
    }
    if (!found) {
      // Cannot find non-colliding position
      grid.push([cur]);
    }
    if (lastEndTime === null || lastEndTime < cur.end) {
      lastEndTime = cur.end;
    }
  }
  if (grid.length > 0) {
    // Add render info from remaining one
    addRenderInfo(grid);
  }
  return renderInfo;
}
