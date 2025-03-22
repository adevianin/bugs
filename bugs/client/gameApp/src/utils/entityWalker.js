import { distance } from './distance';

function _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
    let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
    let distancePassed = distance * (flayedPercent  / 100);
    return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
}

function entityWalker(entity, destPos, userSpeed, timeMultiplier) {
    let startPos = entity.position;
    let dist = distance(startPos.x, startPos.y, destPos.x, destPos.y);
    let wholeWalkTime = timeMultiplier * (dist / userSpeed) * 1000;
    let walkStartAt = Date.now();

    return new Promise((res, rej) => {
        function updatePosition() {
            let timeInWalk = Date.now() - walkStartAt;
            let walkedPercent = (100 * timeInWalk) / wholeWalkTime;

            if (walkedPercent < 100) {
                let currentX = _calcCoordForWalkedPercent(startPos.x, destPos.x, walkedPercent);
                let currentY = _calcCoordForWalkedPercent(startPos.y, destPos.y, walkedPercent);
                entity.setPosition(currentX, currentY, true);

                requestAnimationFrame(updatePosition);
            } else {
                entity.setPosition(destPos.x, destPos.y, false);
                res();
            }
        }

        requestAnimationFrame(updatePosition);
    });
}


export {
    entityWalker
}