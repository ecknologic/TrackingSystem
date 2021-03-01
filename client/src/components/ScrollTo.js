import { useEffect } from "react";

export default function ScrollTo({ parent, child, dep }) {

    useEffect(() => {
        let divElem, chElem, topPos;
        divElem = document.querySelector(parent).parentNode;
        chElem = document.querySelector(child);

        if (divElem && chElem) {
            topPos = chElem.offsetTop;
            divElem.scrollTop = topPos
        }
    }, [dep]);

    return null;
}