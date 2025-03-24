function calculateRotationAngle(entityPosition, targetPosition) {
    return (Math.atan2(targetPosition.y - entityPosition.y, targetPosition.x - entityPosition.x) * 180 / Math.PI) + 90;
}

export {
    calculateRotationAngle
}