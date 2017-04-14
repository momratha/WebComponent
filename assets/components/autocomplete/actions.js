export default class Actions {

    asyncFun(url, callBackFun) {
        fetch(url)
        .then(
            response => {
                if (response.status !== 200) {
                    console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                    return;
                }

                // Examine the text in the response
                response.json().then(data => {
                    callBackFun(data);
                });
            }
        )
        .catch(err => {
            console.log('Fetch Error :-S', err);
        });

    }

    getDisplayData({searchOption, data, keyword}) {
        let htmlObj = {
            className: 'hide',
            html: ''
        };
        if (data !== null) {
            let options = [];
            data.forEach((row) => {
                const name = row.name;
                const last = name.last;
                const first = name.first;
                const profile = row.profile;
                switch (searchOption) {
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
                htmlObj.className = 'show ul_tag';
                htmlObj.html = options.join('');
            }

            return htmlObj;
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
}