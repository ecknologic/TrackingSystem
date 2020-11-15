import React from 'react'
import Icon from '@ant-design/icons';

const ArrowSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18">
        <path fill="#0062FF" fill-rule="evenodd" d="M.34 9.75a1 1 0 01-.1-1.4l7-8A1 1 0 018 0a1 1 0 01.82.43l6.93 7.91a1 1 0 11-1.5 1.32L9 3.67V17a1 1 0 01-.88 1H8a1 1 0 01-1-1V3.65l-5.25 6a1 1 0 01-1.3.18z" />
    </svg>
);
const CrossSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
        <path fill="#4A4A4A" fill-rule="evenodd" d="M.3.3A1 1 0 011.7.3L7 5.58 12.27.32A1 1 0 0113.6.24l.1.08a1 1 0 010 1.41L8.4 7l5.28 5.28a1 1 0 01.08 1.32l-.08.1a1 1 0 01-1.42 0L7 8.4 1.7 13.7a1 1 0 01-1.31.08l-.1-.09a1 1 0 010-1.41L5.6 7 .28 1.7A1 1 0 01.22.4z" />
    </svg>
);
const PlusSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path fill="#0062FF" fill-rule="evenodd" d="M10 8h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H1a1 1 0 010-2h7V1a1 1 0 012 0v7z" />
    </svg>
);
const DDownSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7">
        <path fill="#788995" fill-rule="evenodd" d="M9.68 1.15L5.4 6.5a.5.5 0 01-.78 0L.31 1.15a.5.5 0 01.4-.82h8.58a.5.5 0 01.4.82z" />
    </svg>
);

export const ArrowIcon = props => <Icon component={ArrowSvg} {...props} />
export const CrossIcon = props => <Icon component={CrossSvg} {...props} />
export const PlusIcon = props => <Icon component={PlusSvg} {...props} />
export const DDownIcon = props => <Icon component={DDownSvg} {...props} />
