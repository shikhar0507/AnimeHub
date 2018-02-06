const attributeExceptions = [
    `role`,
  ];

function addText(el, text){
    const textNode = document.createTextNode(text);
    el.appendChild(textNode);
}

function addArr(el, children){
children.forEach(child => {
    
    if(Array.isArray(child)) {
        addArr(el, child);
    }
    else if (child instanceof window.Element) {
        el.appendChild(child);
    }
    else if (typeof child === 'string') {
        
        addText(el, child);
    }
});
}

function addStyles(el, styles){
    if(!styles) {
        el.removeAttribute(styles);
        return;
    }
    Object.keys(styles).forEach((styleName) => {
        if(styleName in el.style) {
            el.style[styleName] = styles[styleName];
        } else {
            console.log("not valid style");
            
        }
    })
}


function makeEl(type, htmObj, ...otherChild) {
    const el = document.createElement(type);

    if(Array.isArray(htmObj)) {
        console.log("yes");
        
        addArr(el,htmObj);

    }
    else if (htmObj instanceof window.Element) {
        el.appendChild(htmObj);
    }
    else if (typeof htmObj === 'string') {
        addText(el, htmObj);
    }
    else if (typeof htmObj === 'object') {
        Object.keys(htmObj).forEach((property) => {

            if (property in el || attributeExceptions.includes(property)) {
                const val = htmObj[property];
                if (property === 'style') {
                    addStyles(el, val);
                } else if (val) {
                    el[property] = val;
                }
            } else {
                console.log("not a valid property");
                
            }
            
        });

    }
    if(otherChild) {
        addArr(el, otherChild);
    }
    return el;
}

const div = (...args) => makeEl(`div` , ...args);
