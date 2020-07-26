import { IEventInfo } from '../utils/types';

type EventInfo = {
  event: IEventInfo,
  visibleStartV: Date,
  visibleEndV: Date,
};

type RenderInfo = {
  event: IEventInfo,
  visibleStartV: Date,
  visibleEndV: Date,
  colIdx: number,
  colCount: number,
  fullColCount: number,
}[];

function getEventWidth(target: EventInfo, nextCol: number, curGrid: EventInfo[][]): number {
  let width = 1;
  for (let colI = nextCol; colI < curGrid.length; colI += 1) {
    for (let rowI = 0; rowI < curGrid[colI].length; rowI += 1) {
      const tester = curGrid[colI][rowI];
      if (target.visibleStartV < tester.visibleEndV && tester.visibleStartV < target.visibleEndV) {
        // Collision found
        return width;
      }
    }
    width += 1;
  }
  return width;
}

export function getRenderInfo(partDayEventsInfo: EventInfo[]): RenderInfo {
  let lastVisibleEndTime: Date | null = null;
  let grid: EventInfo[][] = [];
  const renderInfo: RenderInfo = [];
  const addRenderInfo = (curGrid: EventInfo[][]) => {
    for (let colI = 0; colI < curGrid.length; colI += 1) {
      for (let rowI = 0; rowI < curGrid[colI].length; rowI += 1) {
        const target = curGrid[colI][rowI];
        renderInfo.push({
          event: target.event,
          visibleStartV: target.visibleStartV,
          visibleEndV: target.visibleEndV,
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
    if (lastVisibleEndTime !== null && lastVisibleEndTime <= cur.visibleStartV) {
      // New colliding group starts. Add render info from previous one
      addRenderInfo(grid);
      grid = [];
      lastVisibleEndTime = null;
    }
    let found = false;
    for (let col = 0; col < grid.length; col += 1) {
      if (grid[col][grid[col].length - 1].visibleEndV <= cur.visibleStartV) {
        grid[col].push(cur);
        found = true;
        break;
      }
    }
    if (!found) {
      // Cannot find non-colliding position
      grid.push([cur]);
    }
    if (lastVisibleEndTime === null || lastVisibleEndTime < cur.visibleEndV) {
      lastVisibleEndTime = cur.visibleEndV;
    }
  }
  if (grid.length > 0) {
    // Add render info from remaining one
    addRenderInfo(grid);
  }
  return renderInfo;
}
