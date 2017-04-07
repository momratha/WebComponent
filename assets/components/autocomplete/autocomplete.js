/**
 * Imports the Sass file, and converts it to a css string for use in the
 * web component's template.
 */
import css from 'css-loader!sass-loader!./autocomplete.scss';
const CSS = css.toString();

import HTML from 'autocomplete.html';

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
        this._getJson(this._setJSONToData.bind(this));
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
            this.input.value = this._lowerToUpperCase(this.selectList.value);
            this._setDefaultStyle();
            this.input.focus();
        }
    }

    /**
     * This function is call when list is selected
     */
    setSelectedNameToInput() {
        this.input.value = this._lowerToUpperCase(this.selectList.value);
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
        const thisApp = this;
        if (thisApp.selectList.className == 'hide') {
            const data = this.autoCompleteData;
            const search = 'off';
            thisApp._appendDataByOption({search, data, thisApp});
            thisApp.input.style.border = 'solid 2px #6699cc';
            thisApp.selectList.focus();
        } else {
            thisApp._setDefaultStyle();
        }
    }

    /**
     * Return Capitalize string
     * @param {string} str - string
     * @returns {string} - return string
     */
    _lowerToUpperCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /* Search by character */
    getListDataByStr(e) {
        const search = 'on';
        const keyDown = 40;
        const thisApp = this;
        const data = this.autoCompleteData;
        thisApp._appendDataByOption({search, data, thisApp});
        if (e.which === keyDown) {
            thisApp.selectList.focus();
            thisApp.input.style.border = 'solid 2px #6699cc';
        }
    }

    _appendDataByOption({search, data, thisApp}) {
        if (data !== null) {
            const input = thisApp.input;
            const keyword = input.value;
            const select = this.selectList;
            const options = [];
            data.forEach((row) => {
                const name = row.name;
                const last = name.last;
                const first = name.first;
                const profile = row.profile;
                switch (search) {
                    case 'on':
                        const firstSearch = first.search(keyword.toLowerCase());
                        const lastSearch = last.search(keyword.toLowerCase());
                        if (firstSearch > -1 || lastSearch > -1) {
                            options.push(`<option style='background-image:url(${profile})' />${first} ${last}</option>`);
                        }

                        break;
                    case 'off': options.push(`<option style='background-image:url(${profile})'>${first} ${last}</option>`);
                        break;
                }
            });
            if (options.length > 0) {
                select.className = 'show ul_tag';
                select.innerHTML = options.join('');
            } else {
                select.className = 'hide';
            }
        }
    }

    _setJSONToData(data) {
        this.autoCompleteData = data;
    }

    _getJson(callbackFunction) {
        const thisApp = this;
        fetch('/api/v1/people')
        .then(
            response => {
                if (response.status !== 200) {
                    console.log(`Looks like there was a problem. Status Code: ${response.status}`);

                    return;
                }

                // Examine the text in the response  
                response.json().then(data => {
                    callbackFunction(data, thisApp);
                });
            }
        )
        .catch(err => {
            console.log('Fetch Error :-S', err);
        });


    }

}

// Register the custom element for use
window.customElements.define('m-autocomplete', MAutocomplete);
