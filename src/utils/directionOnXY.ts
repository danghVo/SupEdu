export default function directionOnXY(offsetX: number, offsetY: number, distanceX: number, distanceY: number) {
    const comparasion = Math.abs(offsetX) - Math.abs(offsetY);

    if (comparasion > 0) {
        if (offsetX > 0) {
            return { x: -distanceX, y: 0 };
        } else return { x: distanceX, y: 0 };
    } else if (offsetY > 0) {
        return { x: 0, y: -distanceY };
    } else return { x: 0, y: distanceY };
}
