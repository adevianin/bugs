import { distance } from './distance';

function _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
    let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
    let distancePassed = distance * (flayedPercent  / 100);
    return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
}

function entityWalker(startPos, destPos, userSpeed, entity) {
    let dist = distance(startPos.x, startPos.y, destPos.x, destPos.y);
    let wholeWalkTime = (dist / userSpeed) * 1000;
    let walkStartAt = Date.now();
    return new Promise((res, rej) => {
        let walkInterval = setInterval(() => {
            let timeInWalk = Date.now() - walkStartAt;
            let walkedPercent = ( 100 * timeInWalk ) / wholeWalkTime;
            if (walkedPercent < 100) {
                let currentX = _calcCoordForWalkedPercent(startPos.x, destPos.x, walkedPercent);
                let currentY = _calcCoordForWalkedPercent(startPos.y, destPos.y, walkedPercent);
                entity.setPosition(currentX, currentY, true);
            } else {
                entity.setPosition(destPos.x, destPos.y, false);
                clearInterval(walkInterval);
                res();
            }
        }, 50);
    });
}

export {
    entityWalker
}