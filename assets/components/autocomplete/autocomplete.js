/**
 * Imports the Sass file, and converts it to a css string for use in the
 * web component's template.
 */
import css from 'css-loader!sass-loader!./autocomplete.scss';
const CSS = css.toString();

import HTML from 'autocomplete.html';
import Actions from './actions.js';
/**
 * @class
 * @memberof  Matrix
 * @classdesc <m-autocomplete> defines an input element that is pre-populated
 *            with fetched data, accessible from a drop down. When the user
 *            types, the drop down shows, and a value can be selected by the
 *            keyboard
 *  or mouse.
 */
class MAutocomplete extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        // Initialise HTML and CSS
        this.shadowRoot.innerHTML = HTML;
        this.autoCompleteData = null;
        const style = document.createElement('style');
        style.innerHTML = CSS;
        this.shadowRoot.prepend(style);
        this.actions = new Actions();
        this.actions.asyncFun('/api/v1/people', this._setJSONToData.bind(this));
        this.input = this.shadowRoot.querySelector('#auto_complete_list');
        this.dropdownBtn = this.shadowRoot.querySelector('#dropdown_btn');
        this.selectList = this.shadowRoot.querySelector('#result_container');
        this.input.addEventListener('keyup', this.getListDataByStr.bind(this));
        this.dropdownBtn.addEventListener('click', this.getAllListData.bind(this));
        this.selectList.addEventListener('blur', this.setInputBlure.bind(this));
        this.selectList.addEventListener('keyup', this.setSelectName.bind(this));
        this.selectList.addEventListener('click', this.setSelectedNameToInput.bind(this));
    }

    /**
     * Set select Name when user press enter key
     * @param {event} e - on keyup e will return the event.
     */
    setSelectName(e) {
        const enterKey = 13;
        if (e.which == enterKey) {
            this.input.value = this.actions._lowerToUpperCase(this.selectList.value);
            this._setDefaultStyle();
            this.input.focus();
        }
    }

    /**
     * This function is call when list is selected
     */
    setSelectedNameToInput() {
        this.input.value = this.actions._lowerToUpperCase(this.selectList.value);
        this._setDefaultStyle();
    }

    /**
     * This function is call when input is lost focus
     */
    setInputBlure() {
        this._setDefaultStyle();
    }

    /**
     * Set input and select style to default
     */
    _setDefaultStyle() {
        this.input.style = '';
        this.selectList.className = 'hide';
    }

    /**
     * Display all the user in the list
     */
    getAllListData() {
        const _this = this;
        if (_this.selectList.className == 'hide') {
            const data = _this.autoCompleteData;
            const searchOption = 'off';
            const select = this.selectList;
            const displayObj = this.actions.getDisplayData({searchOption, data});
            select.className = displayObj.className;
            select.innerHTML = displayObj.html;
            _this.input.style.border = 'solid 2px #6699cc';
            select.focus();
        } else {
            _this._setDefaultStyle();
        }
    }

    /* Search by character */
    getListDataByStr(e) {
        const searchOption = 'on';
        const keyDown = 40;
        const _this = this;
        const data = this.autoCompleteData;
        _this._appendDataByOption({searchOption, data, _this});
        if (e.which === keyDown) {
            _this.selectList.focus();
            _this.input.style.border = 'solid 2px #6699cc';
        }
    }

    _appendDataByOption({searchOption, data, _this}) {
        if (data !== null) {
            const input = _this.input;
            const keyword = input.value;
            const select = this.selectList;
            const displayObj = this.actions.getDisplayData({searchOption, data, keyword});
            select.className = displayObj.className;
            select.innerHTML = displayObj.html;
        }
    }

    _setJSONToData(data) {
        this.autoCompleteData = data;
    }

}

// Register the custom element for use
window.customElements.define('m-autocomplete', MAutocomplete);
