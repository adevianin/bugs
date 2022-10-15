import { Entity } from './entity';

class Bug extends Entity {

    updateEntity(entityJson) {
        this.position = entityJson.pos;
    }

}

export { Bug }