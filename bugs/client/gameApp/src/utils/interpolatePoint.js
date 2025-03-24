function interpolatePoint(p1, p2, t) {
    const x = p1.x + (p2.x - p1.x) * t;
    const y = p1.y + (p2.y - p1.y) * t;
    return { x, y };
}

export {
    interpolatePoint
}