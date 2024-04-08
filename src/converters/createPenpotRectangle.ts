import { NodeData } from '../interfaces';
import { PenpotFile } from '../penpot';
import { translateFills } from '../translators';

export const createPenpotRectangle = (
  file: PenpotFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.createRect({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills /*, node.width, node.height*/)
  });
};
