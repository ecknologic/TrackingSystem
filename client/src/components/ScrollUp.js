import { useEffect } from "react";

export default function ScrollUp({ dep }) {

    useEffect(() => {
        let divElem, chElem, topPos;
        divElem = document.querySelector('#content').parentNode;

        if (divElem) chElem = divElem;
        if (chElem) {
            topPos = divElem.offsetTop;
            divElem.scrollTop = topPos - chElem.offsetTo
        }
    }, [dep]);

    return null;
}