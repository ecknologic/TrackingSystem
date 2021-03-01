import { useEffect } from "react";

export default function ScrollUp({ dep, parent = '#content' }) {

    useEffect(() => {
        let divElem, chElem, topPos;
        const el = document.querySelector(parent)
        if (el) divElem = el.parentNode;

        if (divElem) chElem = divElem;
        if (chElem) {
            topPos = divElem.offsetTop;
            divElem.scrollTop = topPos - chElem.offsetTo
        }
    }, [dep]);

    return null;
}