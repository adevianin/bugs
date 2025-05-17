import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import antStatsTmpl from './antStatsTmpl.html'
import { convertStepsToYear } from "@utils/convertStepsToYear";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import '@view/panel/icons/statsMaxHpIcon.png';
import '@view/panel/icons/statsStrengthIcon.png';
import '@view/panel/icons/statsDefenseIcon.png';
import '@view/panel/icons/statsHpRegenRateIcon.png';
import '@view/panel/icons/statsSpeedIcon.png';
import '@view/panel/icons/statsSightDistanceIcon.png';
import '@view/panel/icons/statsMinTempIcon.png';
import '@view/panel/icons/statsLifeSpanIcon.png';
import '@view/panel/icons/statsAppetiteIcon.png';

class AntStatsView extends BaseGameHTMLView {

    constructor(stats) {
        super(document.createElement('table'));
        this._stats = stats;

        this._render();
    }

    setStats(stats) {
        this._stats = stats;
        this._renderStats();
    }

    _render() {
        this._el.innerHTML = antStatsTmpl;
        this._el.classList.add('g-table');
        this._el.classList.add('ant-stats__table');
        
        if (this._stats) {
            this._renderStats();
        }

        this._el.querySelector('[data-max-hp-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_MAX_HP));
        this._el.querySelector('[data-hp-regen-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_HP_REGEN_RATE));
        this._el.querySelector('[data-speed-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_SPEED));
        this._el.querySelector('[data-sight-distance-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_SIGHT_DISTANCE));
        this._el.querySelector('[data-strength-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_STRENGTH));
        this._el.querySelector('[data-defense-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_DEFENSE));
        this._el.querySelector('[data-appetite-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_APPETITE));
        this._el.querySelector('[data-min-temp-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_MIN_TEMP));
        this._el.querySelector('[data-life-span-stat-title]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.STATS_LABEL_LIFE_SPAN));
    }

    _renderStats() {
        this._el.querySelector('[data-max-hp]').innerHTML = this._stats.maxHp;
        this._el.querySelector('[data-hp-regen-rate]').innerHTML =  this._stats.hpRegenRate;
        this._el.querySelector('[data-speed]').innerHTML = this._stats.distancePerStep;
        this._el.querySelector('[data-sight-distance]').innerHTML = this._stats.sightDistance;
        this._el.querySelector('[data-strength]').innerHTML = this._stats.strength;
        this._el.querySelector('[data-defense]').innerHTML = this._stats.defence;
        this._el.querySelector('[data-appetite]').innerHTML = this._stats.appetite;
        this._el.querySelector('[data-min-temperature]').innerHTML = this._stats.minTemperature;
        this._el.querySelector('[data-life-span]').innerHTML = convertStepsToYear(this._stats.lifeSpan, true);
    }

}

export {
    AntStatsView
}