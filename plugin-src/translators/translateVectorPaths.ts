import { CurveToCommand, LineToCommand, MoveToCommand, parseSVG } from 'svg-path-parser';

import { Segment } from '@ui/lib/types/shapes/pathShape';

export const translateVectorPaths = (
  paths: VectorPaths,
  baseX: number,
  baseY: number
): Segment[] => {
  let segments: Segment[] = [];

  for (const path of paths) {
    segments = [...segments, ...translateVectorPath(path, baseX, baseY)];
  }

  return segments;
};

export const createLineGeometry = (node: LineNode): VectorPaths => {
  const commands: (MoveToCommand | LineToCommand)[] = [];

  commands.push({
    command: 'moveto',
    code: 'M',
    x: 0,
    y: 0
  });

  commands.push({
    command: 'lineto',
    code: 'L',
    x: node.width,
    y: node.height
  });

  return [
    {
      windingRule: 'NONZERO',
      data: commands.map(({ code, x, y }) => `${code} ${x} ${y}`).join(' ') + ' Z'
    }
  ];
};

const translateVectorPath = (path: VectorPath, baseX: number, baseY: number): Segment[] => {
  const normalizedPaths = parseSVG(path.data);

  return normalizedPaths.map(command => {
    switch (command.command) {
      case 'moveto':
        return translateMoveToCommand(command, baseX, baseY);
      case 'lineto':
        return translateLineToCommand(command, baseX, baseY);
      case 'curveto':
        return translateCurveToCommand(command, baseX, baseY);
      case 'closepath':
      default:
        return {
          command: 'close-path'
        };
    }
  });
};

const translateMoveToCommand = (command: MoveToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'move-to',
    params: { x: command.x + baseX, y: command.y + baseY }
  };
};

const translateLineToCommand = (command: LineToCommand, baseX: number, baseY: number): Segment => {
  return {
    command: 'line-to',
    params: { x: command.x + baseX, y: command.y + baseY }
  };
};

const translateCurveToCommand = (
  command: CurveToCommand,
  baseX: number,
  baseY: number
): Segment => {
  return {
    command: 'curve-to',
    params: {
      c1x: command.x1 + baseX,
      c1y: command.y1 + baseY,
      c2x: command.x2 + baseX,
      c2y: command.y2 + baseY,
      x: command.x + baseX,
      y: command.y + baseY
    }
  };
};
