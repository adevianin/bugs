import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import helpTabTmpl from './helpTabTmpl.html';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import breedingIconUrl from '@view/panel/icons/mainTabSwitcherIcons/breedingIcon.png';
import coloniesIconUrl from '@view/panel/icons/mainTabSwitcherIcons/coloniesIcon.png';
import specieIconUrl from '@view/panel/icons/mainTabSwitcherIcons/specieIcon.png';

class HelpTabView extends BaseGameHTMLView {

    constructor(el, tabScrollElement) {
        super(el);
        this._tabScrollElement = tabScrollElement;

        this._render();
    }

    showSection(sectionId) {
        let highlightClassName = 'help__section--highlighted';
        let section = this._el.querySelector(`[data-section="${sectionId}"]`);
        this._tabScrollElement.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
        section.classList.add(highlightClassName);
        setTimeout(() => section.classList.remove(highlightClassName), 1000);
    }

    _render() {
        this._el.innerHTML = helpTabTmpl;

        this._el.querySelector('[data-section-title-world]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_WORLD);
        this._el.querySelector('[data-section-title-start]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_START);
        this._el.querySelector('[data-section-title-breeding]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_BREEDING);
        this._el.querySelector('[data-section-title-colonies]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_COLONIES);
        this._el.querySelector('[data-subsection-title-colonies-ants]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_ANTS);
        this._el.querySelector('[data-subsection-title-colonies-operations]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_OPERATIONS);
        this._el.querySelector('[data-subsection-title-colonies-nests]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_NESTS);
        this._el.querySelector('[data-subsection-title-colonies-enemies]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_TITLE_COLONIES_ENEMIES);
        this._el.querySelector('[data-section-title-specie]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_TITLE_SPECIE);
        this._el.querySelector('[data-section-content-world]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_WORLD);
        this._el.querySelector('[data-section-content-start]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_START);
        this._el.querySelector('[data-section-content-breeding]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_BREEDING);
        this._el.querySelector('[data-section-content-colonies]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_COLONIES);
        this._el.querySelector('[data-subsection-content-colonies-ants]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_ANTS);
        this._el.querySelector('[data-subsection-content-colonies-operations]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_OPERATIONS);
        this._el.querySelector('[data-subsection-content-colonies-nests]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_NESTS);
        this._el.querySelector('[data-subsection-content-colonies-enemies]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SUBSECTION_CONTENT_COLONIES_ENEMIES);
        this._el.querySelector('[data-section-content-specie]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_SPECIE);
        this._el.querySelector('[data-section-contacts]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.HELP_TAB_SECTION_CONTENT_CONTACTS);
        
        this._renderTabIconToContainer(this._el.querySelector('[data-breeding-tab-icon-container]'), breedingIconUrl);
        this._renderTabIconToContainer(this._el.querySelector('[data-colonies-tab-icon-container]'), coloniesIconUrl);
        this._renderTabIconToContainer(this._el.querySelector('[data-specie-tab-icon-container]'), specieIconUrl);
    }

    _renderTabIconToContainer(container, iconUrl) {
        let img = document.createElement('img');
        img.classList.add('help__tab-icon-img');
        img.src = iconUrl;
        container.appendChild(img);
    }

}

export {
    HelpTabView
}