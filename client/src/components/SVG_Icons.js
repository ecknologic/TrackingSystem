import React from 'react'
import Icon from '@ant-design/icons';
const primaryColor = '#0062FF';
const secondaryColor = '#5C63AB';


const ArrowSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18">
        <path fill={primaryColor} fillRule="evenodd" d="M.34 9.75a1 1 0 01-.1-1.4l7-8A1 1 0 018 0a1 1 0 01.82.43l6.93 7.91a1 1 0 11-1.5 1.32L9 3.67V17a1 1 0 01-.88 1H8a1 1 0 01-1-1V3.65l-5.25 6a1 1 0 01-1.3.18z" />
    </svg>
);
const CrossSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
        <path fill="#4A4A4A" fillRule="evenodd" d="M.3.3A1 1 0 011.7.3L7 5.58 12.27.32A1 1 0 0113.6.24l.1.08a1 1 0 010 1.41L8.4 7l5.28 5.28a1 1 0 01.08 1.32l-.08.1a1 1 0 01-1.42 0L7 8.4 1.7 13.7a1 1 0 01-1.31.08l-.1-.09a1 1 0 010-1.41L5.6 7 .28 1.7A1 1 0 01.22.4z" />
    </svg>
);
const PlusSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path fill={primaryColor} fillRule="evenodd" d="M10 8h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H1a1 1 0 010-2h7V1a1 1 0 012 0v7z" />
    </svg>
);
const DDownSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7">
        <path fill="#788995" fillRule="evenodd" d="M9.68 1.15L5.4 6.5a.5.5 0 01-.78 0L.31 1.15a.5.5 0 01.4-.82h8.58a.5.5 0 01.4.82z" />
    </svg>
);
const DashboardComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fill-rule="evenodd" d="M4 10h1a4 4 0 014 4v2a4 4 0 01-4 4H4a4 4 0 01-4-4v-2a4 4 0 014-4zm0 2a2 2 0 00-2 2v2c0 1.1.9 2 2 2h1a2 2 0 002-2v-2a2 2 0 00-2-2H4zM3.5 0A3.5 3.5 0 017 3.5v1a3.5 3.5 0 01-7 0v-1A3.5 3.5 0 013.5 0zm0 2C2.67 2 2 2.67 2 3.5v1a1.5 1.5 0 003 0v-1C5 2.67 4.33 2 3.5 2zM15 9h1a4 4 0 014 4v3a4 4 0 01-4 4h-1a4 4 0 01-4-4v-3a4 4 0 014-4zm0 2a2 2 0 00-2 2v3c0 1.1.9 2 2 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1zM12.5 0h4a3.5 3.5 0 010 7h-4a3.5 3.5 0 010-7zm0 2a1.5 1.5 0 000 3h4a1.5 1.5 0 000-3h-4z" />
    </svg>
);
const SettingComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22">
        <path fill={color} fill-rule="evenodd" d="M10 0c1.4 0 2.62.98 2.9 2.34l.06.26c1.06.37 2.04.93 2.89 1.66l.26-.09c1.33-.43 2.79.12 3.5 1.33.7 1.2.45 2.74-.6 3.67l-.2.18c.21 1.09.2 2.21 0 3.3l.2.18c1.05.93 1.3 2.46.6 3.67a2.98 2.98 0 01-3.5 1.33l-.26-.09a9 9 0 01-2.89 1.66l-.05.26A2.96 2.96 0 0110 22c-1.4 0-2.62-.98-2.9-2.34l-.06-.26a8.97 8.97 0 01-2.89-1.66l-.26.09A2.98 2.98 0 01.4 16.5c-.7-1.2-.45-2.74.6-3.67l.2-.18c-.21-1.09-.2-2.21 0-3.3l-.2-.18a2.93 2.93 0 01-.6-3.67 2.98 2.98 0 013.5-1.33l.26.09A9 9 0 017.04 2.6l.05-.26A2.96 2.96 0 0110 0zm0 2a.95.95 0 00-.93.75l-.18.84a1 1 0 01-.72.76A7 7 0 005.1 6.1c-.27.26-.67.36-1.02.24l-.82-.27a.96.96 0 00-1.13.43.94.94 0 00.2 1.18l.64.57a1 1 0 01.3 1 6.83 6.83 0 000 3.5 1 1 0 01-.3 1l-.65.57a.94.94 0 00-.19 1.18c.23.39.7.57 1.13.43l.82-.27c.36-.12.75-.02 1.02.24.85.84 1.9 1.44 3.06 1.75.36.1.64.4.72.76l.18.84c.09.44.48.75.93.75.45 0 .84-.31.93-.75l.18-.84a1 1 0 01.72-.76 7 7 0 003.06-1.75c.27-.26.67-.36 1.02-.24l.82.27c.43.14.9-.04 1.13-.43a.94.94 0 00-.2-1.18l-.64-.57a1 1 0 01-.3-1c.3-1.15.3-2.35 0-3.5a1 1 0 01.3-1l.65-.57c.33-.3.41-.8.19-1.18a.96.96 0 00-1.13-.43l-.82.27c-.36.12-.75.02-1.02-.24a6.95 6.95 0 00-3.06-1.75 1 1 0 01-.72-.76l-.18-.84A.95.95 0 0010 2zm0 5.37A3.65 3.65 0 0113.66 11c0 2-1.64 3.63-3.66 3.63A3.65 3.65 0 016.34 11c0-2 1.64-3.63 3.66-3.63zm0 2c-.9 0-1.64.73-1.64 1.63 0 .9.73 1.63 1.64 1.63.9 0 1.64-.73 1.64-1.63 0-.9-.73-1.63-1.64-1.63z" />
    </svg>
);
const FriendReqComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <g fill="none" fill-rule="evenodd" transform="translate(-1 -1)">
            <circle cx="12" cy="12" r="12" />
            <path fill={color} d="M9 12a8 8 0 018 8v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2a8 8 0 018-8zm0 2a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm11-6v2h2c1.33 0 1.33 2 0 2h-2v2c0 1.33-2 1.33-2 0v-2h-2c-1.33 0-1.33-2 0-2h2V8c0-1.33 2-1.33 2 0zM9 1a5 5 0 110 10A5 5 0 019 1zm0 2a3 3 0 100 6 3 3 0 000-6z" />
        </g>
    </svg>
);
const ProjectComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path fill={color} fill-rule="evenodd" d="M15 0a7 7 0 017 7v8a7 7 0 01-7 7H7a7 7 0 01-7-7V7a7 7 0 017-7h8zm0 2H7a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V7a5 5 0 00-5-5zm-.78 5.36a1 1 0 111.54 1.28l-4.95 6a1 1 0 01-1.47.07l-3.05-3a1 1 0 111.4-1.43l2.27 2.24z" />
    </svg>
);
const DashboardSvg = () => <DashboardComponent color={primaryColor} />;
const DashboardSvgLight = () => <DashboardComponent color={secondaryColor} />;
const FriendReqSvg = () => <FriendReqComponent color={primaryColor} />;
const FriendReqSvgLight = () => <FriendReqComponent color={secondaryColor} />;
const SettingSvg = () => <SettingComponent color={primaryColor} />;
const SettingSvgLight = () => <SettingComponent color={secondaryColor} />;
const ProjectSvg = () => <ProjectComponent color={primaryColor} />;
const ProjectSvgLight = () => <ProjectComponent color={secondaryColor} />;

export const ArrowIcon = props => <Icon component={ArrowSvg} {...props} />
export const CrossIcon = props => <Icon component={CrossSvg} {...props} />
export const PlusIcon = props => <Icon component={PlusSvg} {...props} />
export const DDownIcon = props => <Icon component={DDownSvg} {...props} />
export const DashboardIcon = props => <Icon component={DashboardSvg} {...props} />
export const DashboardIconLight = props => <Icon component={DashboardSvgLight} {...props} />
export const SettingIcon = props => <Icon component={SettingSvg} {...props} />
export const SettingIconLight = props => <Icon component={SettingSvgLight} {...props} />
export const FriendReqIcon = props => <Icon component={FriendReqSvg} {...props} />
export const FriendReqIconLight = props => <Icon component={FriendReqSvgLight} {...props} />
export const ProjectIcon = props => <Icon component={ProjectSvg} {...props} />
export const ProjectIconLight = props => <Icon component={ProjectSvgLight} {...props} />
