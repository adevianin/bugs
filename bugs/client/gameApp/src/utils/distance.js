function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1  -x2), 2) + Math.pow((y1 - y2), 2));
}

function distance_point(point1, point2) {
    return distance(point1.x, point1.y, point2.x, point2.y)
}

export {
    distance,
    distance_point
}