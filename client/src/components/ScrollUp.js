import { useEffect } from "react";

export default function ScrollUp({ dep }) {

    useEffect(() => {
        let divElem, chElem, topPos;
        divElem = document.getElementById('scroll-view').firstChild;

        console.log(divElem)
        if (divElem) chElem = divElem.firstChild;
        if (chElem) {
            topPos = divElem.offsetTop;
            divElem.scrollTop = topPos - chElem.offsetTo
        }
    }, [dep]);

    return null;
}