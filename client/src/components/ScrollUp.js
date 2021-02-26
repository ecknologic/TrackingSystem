import { useEffect } from "react";

export default function ScrollUp({ dep, parent = '#content' }) {

    useEffect(() => {
        let divElem, chElem, topPos;
        divElem = document.querySelector(parent).parentNode;

        if (divElem) chElem = divElem;
        if (chElem) {
            topPos = divElem.offsetTop;
            divElem.scrollTop = topPos - chElem.offsetTo
        }
    }, [dep]);

    return null;
}