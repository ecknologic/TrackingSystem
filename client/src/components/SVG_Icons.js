import React from 'react'
import Icon from '@ant-design/icons'
const primaryColor = '#0062FF'
const secondaryColor = '#5C63AB'
const greyColor = '#92929D'
const darkColor = '#4A4A4A'
const whiteColor = '#FFFFFF'
const redColor = '#FC5A5A'


const ArrowComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18">
        <path fill={color} fillRule="evenodd" d="M.34 9.75a1 1 0 01-.1-1.4l7-8A1 1 0 018 0a1 1 0 01.82.43l6.93 7.91a1 1 0 11-1.5 1.32L9 3.67V17a1 1 0 01-.88 1H8a1 1 0 01-1-1V3.65l-5.25 6a1 1 0 01-1.3.18z" />
    </svg>
)
const PlusComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path fill={color} fillRule="evenodd" d="M10 8h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H1a1 1 0 010-2h7V1a1 1 0 012 0v7z" />
    </svg>
)
const DDownSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7">
        <path fill="#788995" fillRule="evenodd" d="M9.68 1.15L5.4 6.5a.5.5 0 01-.78 0L.31 1.15a.5.5 0 01.4-.82h8.58a.5.5 0 01.4.82z" />
    </svg>
)
const DashboardComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M4 10h1a4 4 0 014 4v2a4 4 0 01-4 4H4a4 4 0 01-4-4v-2a4 4 0 014-4zm0 2a2 2 0 00-2 2v2c0 1.1.9 2 2 2h1a2 2 0 002-2v-2a2 2 0 00-2-2H4zM3.5 0A3.5 3.5 0 017 3.5v1a3.5 3.5 0 01-7 0v-1A3.5 3.5 0 013.5 0zm0 2C2.67 2 2 2.67 2 3.5v1a1.5 1.5 0 003 0v-1C5 2.67 4.33 2 3.5 2zM15 9h1a4 4 0 014 4v3a4 4 0 01-4 4h-1a4 4 0 01-4-4v-3a4 4 0 014-4zm0 2a2 2 0 00-2 2v3c0 1.1.9 2 2 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1zM12.5 0h4a3.5 3.5 0 010 7h-4a3.5 3.5 0 010-7zm0 2a1.5 1.5 0 000 3h4a1.5 1.5 0 000-3h-4z" />
    </svg>
)
const SettingComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22">
        <path fill={color} fillRule="evenodd" d="M10 0c1.4 0 2.62.98 2.9 2.34l.06.26c1.06.37 2.04.93 2.89 1.66l.26-.09c1.33-.43 2.79.12 3.5 1.33.7 1.2.45 2.74-.6 3.67l-.2.18c.21 1.09.2 2.21 0 3.3l.2.18c1.05.93 1.3 2.46.6 3.67a2.98 2.98 0 01-3.5 1.33l-.26-.09a9 9 0 01-2.89 1.66l-.05.26A2.96 2.96 0 0110 22c-1.4 0-2.62-.98-2.9-2.34l-.06-.26a8.97 8.97 0 01-2.89-1.66l-.26.09A2.98 2.98 0 01.4 16.5c-.7-1.2-.45-2.74.6-3.67l.2-.18c-.21-1.09-.2-2.21 0-3.3l-.2-.18a2.93 2.93 0 01-.6-3.67 2.98 2.98 0 013.5-1.33l.26.09A9 9 0 017.04 2.6l.05-.26A2.96 2.96 0 0110 0zm0 2a.95.95 0 00-.93.75l-.18.84a1 1 0 01-.72.76A7 7 0 005.1 6.1c-.27.26-.67.36-1.02.24l-.82-.27a.96.96 0 00-1.13.43.94.94 0 00.2 1.18l.64.57a1 1 0 01.3 1 6.83 6.83 0 000 3.5 1 1 0 01-.3 1l-.65.57a.94.94 0 00-.19 1.18c.23.39.7.57 1.13.43l.82-.27c.36-.12.75-.02 1.02.24.85.84 1.9 1.44 3.06 1.75.36.1.64.4.72.76l.18.84c.09.44.48.75.93.75.45 0 .84-.31.93-.75l.18-.84a1 1 0 01.72-.76 7 7 0 003.06-1.75c.27-.26.67-.36 1.02-.24l.82.27c.43.14.9-.04 1.13-.43a.94.94 0 00-.2-1.18l-.64-.57a1 1 0 01-.3-1c.3-1.15.3-2.35 0-3.5a1 1 0 01.3-1l.65-.57c.33-.3.41-.8.19-1.18a.96.96 0 00-1.13-.43l-.82.27c-.36.12-.75.02-1.02-.24a6.95 6.95 0 00-3.06-1.75 1 1 0 01-.72-.76l-.18-.84A.95.95 0 0010 2zm0 5.37A3.65 3.65 0 0113.66 11c0 2-1.64 3.63-3.66 3.63A3.65 3.65 0 016.34 11c0-2 1.64-3.63 3.66-3.63zm0 2c-.9 0-1.64.73-1.64 1.63 0 .9.73 1.63 1.64 1.63.9 0 1.64-.73 1.64-1.63 0-.9-.73-1.63-1.64-1.63z" />
    </svg>
)
const FriendReqComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <g fill="none" fillRule="evenodd" transform="translate(-1 -1)">
            <circle cx="12" cy="12" r="12" />
            <path fill={color} d="M9 12a8 8 0 018 8v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2a8 8 0 018-8zm0 2a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm11-6v2h2c1.33 0 1.33 2 0 2h-2v2c0 1.33-2 1.33-2 0v-2h-2c-1.33 0-1.33-2 0-2h2V8c0-1.33 2-1.33 2 0zM9 1a5 5 0 110 10A5 5 0 019 1zm0 2a3 3 0 100 6 3 3 0 000-6z" />
        </g>
    </svg>
)
const ProjectComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path fill={color} fillRule="evenodd" d="M15 0a7 7 0 017 7v8a7 7 0 01-7 7H7a7 7 0 01-7-7V7a7 7 0 017-7h8zm0 2H7a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V7a5 5 0 00-5-5zm-.78 5.36a1 1 0 111.54 1.28l-4.95 6a1 1 0 01-1.47.07l-3.05-3a1 1 0 111.4-1.43l2.27 2.24z" />
    </svg>
)
const FriendsComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path fill={color} fillRule="evenodd" d="M11 6a3 3 0 110-6 3 3 0 010 6zm0-2a1 1 0 100-2 1 1 0 000 2zm-1 2h2a3 3 0 013 3v1a3 3 0 01-3 3h-2a3 3 0 01-3-3V9a3 3 0 013-3zm0 2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2zm8 7a3 3 0 110-6 3 3 0 010 6zm0-2a1 1 0 100-2 1 1 0 000 2zm-1 2h2a3 3 0 013 3v1a3 3 0 01-3 3h-2a3 3 0 01-3-3v-1a3 3 0 013-3zm0 2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2zM4 15a3 3 0 110-6 3 3 0 010 6zm0-2a1 1 0 100-2 1 1 0 000 2zm-1 2h2a3 3 0 013 3v1a3 3 0 01-3 3H3a3 3 0 01-3-3v-1a3 3 0 013-3zm0 2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1H3z" />
    </svg>
)
const FriendComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18">
        <path fill={color} fillRule="evenodd" d="M2.77 4.82A4.78 4.78 0 017.5 0a4.78 4.78 0 014.73 4.82c0 1.68-.83 3.15-2.1 4.02A7.65 7.65 0 0115 16v2H0v-2a7.65 7.65 0 014.87-7.16 4.84 4.84 0 01-2.1-4.02zm4.73 2.7a2.68 2.68 0 002.65-2.7c0-1.5-1.18-2.7-2.65-2.7a2.68 2.68 0 00-2.65 2.7c0 1.5 1.18 2.7 2.65 2.7zm0 2.95a5.47 5.47 0 00-5.42 5.41h10.84a5.47 5.47 0 00-5.42-5.4z" />
    </svg>
)
const SearchComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20">
        <g fill="none" fillRule="evenodd">
            <path d="M-2-2h24v24H-2z" />
            <path fill={color} d="M15.64 2.68a9.16 9.16 0 01.84 11.99l3.61 3.61c.95.95-.47 2.36-1.41 1.42l-3.57-3.57a9.16 9.16 0 11.53-13.45zM4.1 4.1a7.16 7.16 0 1010.12 10.12A7.16 7.16 0 004.1 4.1z" />
        </g>
    </svg>
)
const FilterComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18">
        <path fill={color} fillRule="evenodd" d="M13 9.91V15a1 1 0 01-.55.9l-4 2A1 1 0 017 17V9.91L.23 1.63A1 1 0 011 0h18a1 1 0 01.77 1.63L13 9.91zm-2 4.47V9.56a1 1 0 01.23-.64L16.89 2H3.11l5.66 6.92a1 1 0 01.23.64v5.82l2-1z" />
    </svg>
)
const CardViewComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <g fill="none" fillRule="evenodd">
            <path d="M-2-2h24v24H-2z" />
            <path fill={color} d="M2.2 0h5.2c1.22 0 2.21.99 2.21 2.2v5.2a2.2 2.2 0 01-2.2 2.21H2.2A2.2 2.2 0 010 7.41V2.2C0 .99.99 0 2.2 0zm0 1.82a.39.39 0 00-.38.39v5.2c0 .2.17.38.39.38h5.2c.2 0 .38-.17.38-.39V2.2a.39.39 0 00-.39-.38H2.2zm10.4 8.57h5.2c1.21 0 2.2.99 2.2 2.2v5.2A2.2 2.2 0 0117.8 20h-5.2a2.2 2.2 0 01-2.21-2.2v-5.2c0-1.22.99-2.21 2.2-2.21zm0 1.82a.39.39 0 00-.4.39v5.2c0 .2.18.38.4.38h5.2c.2 0 .38-.17.38-.39v-5.2a.39.39 0 00-.39-.38h-5.2zM12.6 0h5.2C19 0 20 .99 20 2.2v5.2a2.2 2.2 0 01-2.2 2.21h-5.2a2.2 2.2 0 01-2.21-2.2V2.2c0-1.22.99-2.21 2.2-2.21zm0 1.82a.39.39 0 00-.4.39v5.2c0 .2.18.38.4.38h5.2c.2 0 .38-.17.38-.39V2.2a.39.39 0 00-.39-.38h-5.2zM2.2 10.39h5.2c1.22 0 2.21.99 2.21 2.2v5.2A2.2 2.2 0 017.41 20H2.2A2.2 2.2 0 010 17.8v-5.2c0-1.22.99-2.21 2.2-2.21zm0 1.82a.39.39 0 00-.38.39v5.2c0 .2.17.38.39.38h5.2c.2 0 .38-.17.38-.39v-5.2a.39.39 0 00-.39-.38H2.2z" />
        </g>
    </svg>
)
const ListViewComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path fill={color} fillRule="evenodd" d="M15 14a1 1 0 010 2H1a1 1 0 010-2zm0-7a1 1 0 010 2H1a1 1 0 010-2zm0-7a1 1 0 010 2H1a1 1 0 110-2z" />
    </svg>
)
const FileComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22">
        <path fill={color} fillRule="evenodd" d="M4 0h9.53a2 2 0 011.54.72l4.47 5.36A2 2 0 0120 7.36V18a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4zm14 18V8h-3a2 2 0 01-2-2V2H4a2 2 0 00-2 2v14c0 1.1.9 2 2 2h12a2 2 0 002-2zM16.86 6L15 3.76V6h1.86zM6 13a1 1 0 010-2h8a1 1 0 010 2H6zm0 4a1 1 0 010-2h6a1 1 0 010 2H6zm0-8a1 1 0 110-2h3a1 1 0 010 2H6z" />
    </svg>
)
const EyeComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16">
        <g fill="none" fillRule="evenodd">
            <path d="M-2-4h24v24H-2z" />
            <path d="M-2-4h24v24H-2z" />
            <path fill={color} d="M.11 7.44C1.95 2.9 5.76 0 10 0s8.05 2.9 9.89 7.44c.15.36.15.76 0 1.12C18.05 13.1 14.24 16 10 16S1.95 13.1.11 8.56a1.5 1.5 0 010-1.12zM10 14.15c3.42 0 6.55-2.36 8.15-6.15-1.6-3.79-4.73-6.15-8.15-6.15S3.45 4.21 1.85 8c1.6 3.79 4.73 6.15 8.15 6.15zm0-2.5A3.61 3.61 0 016.42 8c0-2.01 1.6-3.65 3.58-3.65A3.61 3.61 0 0113.58 8c0 2.01-1.6 3.65-3.58 3.65zm0-1.85c.97 0 1.76-.8 1.76-1.8S10.97 6.2 10 6.2 8.24 7 8.24 8 9.03 9.8 10 9.8z" />
        </g>
    </svg>
)
const MoreComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="4">
        <path fill={color} fillRule="evenodd" d="M14 2a2 2 0 114 0 2 2 0 01-4 0zM7 2a2 2 0 114 0 2 2 0 01-4 0zM0 2a2 2 0 114 0 2 2 0 01-4 0z" />
    </svg>
)
const DocComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20">
        <path fill={color} fillRule="evenodd" d="M15.06 5.4L13.7 3.76V5.4h1.36zm3.14 1.33v9.57a3.7 3.7 0 01-3.7 3.7H3.7A3.7 3.7 0 010 16.3V3.7A3.7 3.7 0 013.7 0h8.58c.56 0 1.1.25 1.46.68l4.02 4.83c.28.34.44.77.44 1.22zm-2 .67h-2.6a1.9 1.9 0 01-1.9-1.9V2h-8C2.76 2 2 2.76 2 3.7v12.6c0 .94.76 1.7 1.7 1.7h10.8c.94 0 1.7-.76 1.7-1.7V7.4zM4.1 13.6h10c.16 0 .3.12.3.27v1.46c0 .15-.14.27-.3.27h-10c-.16 0-.3-.12-.3-.27v-1.46c0-.15.14-.27.3-.27z" />
    </svg>
)
const ChatComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <g fill="none" fillRule="evenodd" transform="translate(-1 -1)">
            <circle cx="12" cy="12" r="12" />
            <path fill={color} d="M12 1a11 11 0 019.88 15.84l.76 3.4a2 2 0 01-2.4 2.4l-3.4-.76A11 11 0 1112 1zm0 2a9 9 0 104.24 16.94 1 1 0 01.69-.1l3.75.84-.83-3.75a1 1 0 01.1-.7A9 9 0 0012 3zm-3 7a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
        </g>
    </svg>
)
const NotificationComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21">
        <path fill={color} fillRule="evenodd" d="M9 0a3 3 0 012.98 2.64 7.22 7.22 0 014.24 6.58v5.02l1.67 3.3A1 1 0 0117 19h-5.17a3 3 0 01-5.66 0H1a1 1 0 01-.9-1.45l1.68-3.31V9.22a7.22 7.22 0 014.24-6.58A3 3 0 019 0zm0 4a5.22 5.22 0 00-5.22 5.22v5.26a1 1 0 01-.1.45L2.62 17h12.75l-1.05-2.07a1 1 0 01-.1-.45V9.22A5.22 5.22 0 009 4z" />
    </svg>
)
const LinesComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14">
        <path fill={color} fillRule="evenodd" d="M12 12a1 1 0 010 2H6a1 1 0 010-2zm2-6a1 1 0 010 2H4a1 1 0 010-2zm3-6a1 1 0 010 2H1a1 1 0 110-2z" />
    </svg>
)
const EditComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19">
        <path fill={color} fillRule="evenodd" d="M15.86 5.6l1.12-1.12-2.46-2.46-1.12 1.12 2.46 2.46zM14.46 7L12 4.55l-9.2 9.19-.56 3.02 3.02-.57L14.46 7zm3.98-3.87a1.9 1.9 0 010 2.7L6.45 17.82a1 1 0 01-.52.27l-4.75.9a1 1 0 01-1.16-1.17l.89-4.75a1 1 0 01.27-.52l12-12a1.9 1.9 0 012.69 0l2.57 2.58zM18.01 19H9.99c-1.32 0-1.32-2 0-2h8.02c1.32 0 1.32 2 0 2z" />
    </svg>
)
const TrashComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M5.66 2.7L6.34.68A1 1 0 017.28 0h5.4a1 1 0 01.95.68l.67 2.02h4.68a1 1 0 110 2h-.85l-.74 12.48a3 3 0 01-3 2.82H5.58a3 3 0 01-3-2.82L1.85 4.7H1a1 1 0 110-2h4.66zm2.11 0h4.43l-.24-.7H8l-.23.7zm8.35 2H3.84l.73 12.36a1 1 0 001 .94h8.83a1 1 0 001-.94l.72-12.36zM11.7 7.24a1 1 0 012 .12l-.46 7.2a1 1 0 11-2-.12l.46-7.2zm-2.96 7.2a1 1 0 01-2 .12l-.44-7.2a1 1 0 112-.12l.44 7.2z" />
    </svg>
)
const ScheduleComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21">
        <path fill={color} fillRule="evenodd" d="M22 15a6 6 0 01-6 6H6a6 6 0 01-6-6V5a3 3 0 013-3h2V1a1 1 0 01.88-1H6a1 1 0 011 .88V2h9V1a1 1 0 01.88-1H17a1 1 0 011 .88V2h1a3 3 0 013 3v10zm-2-5H2v5a4 4 0 004 4h10a4 4 0 004-4v-5zM5 4H3a1 1 0 00-1 1v3h18V5a1 1 0 00-1-1h-1a1 1 0 01-2 0H7a1 1 0 01-2 .12V4z" />
    </svg>
)
const LeftChevronComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12">
        <path fill={color} fillRule="evenodd" d="M2.41 6l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.42 1.4L2.4 6z" />
    </svg>
)
const RightChevronComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12">
        <path fill={color} fillRule="evenodd" d="M4.59 6L.29 1.7A1 1 0 011.71.3l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.42-1.4L4.6 6z" />
    </svg>
)
const CrossComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
        <path fill={color} fillRule="evenodd" d="M.3.3A1 1 0 011.7.3L7 5.58 12.27.32A1 1 0 0113.6.24l.1.08a1 1 0 010 1.41L8.4 7l5.28 5.28a1 1 0 01.08 1.32l-.08.1a1 1 0 01-1.42 0L7 8.4 1.7 13.7a1 1 0 01-1.31.08l-.1-.09a1 1 0 010-1.41L5.6 7 .28 1.7A1 1 0 01.22.4z" />
    </svg>
)
const CloseComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <g fill="none" fill-rule="evenodd">
            <path fill={color} d="M7 0h8a7 7 0 017 7v8a7 7 0 01-7 7H7a7 7 0 01-7-7V7a7 7 0 017-7z" />
            <path fill="#FFF" d="M9.41 10.83L7.3 8.7a1 1 0 011.42-1.42l2.12 2.12 2.12-2.12a1 1 0 111.41 1.42l-2.12 2.12 2.12 2.12a1 1 0 11-1.41 1.41l-2.12-2.12-2.12 2.12a1 1 0 01-1.42-1.41l2.12-2.12z" />
        </g>
    </svg>
)
const BlockComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fill-rule="evenodd" d="M16.64 14.46a8 8 0 00-11.1-11.1l11.1 11.1zm-1.31 1.5L4.03 4.69a8 8 0 0011.3 11.3v-.01zM10 0a10 10 0 110 20 10 10 0 010-20z" />
    </svg>
)

const RightChevronSvgGrey = () => <RightChevronComponent color={greyColor} />
const LeftChevronSvgGrey = () => <LeftChevronComponent color={greyColor} />
const BlockSvgGrey = () => <BlockComponent color={greyColor} />
const ArrowSvg = () => <ArrowComponent color={primaryColor} />
const ScheduleSvg = () => <ScheduleComponent color={primaryColor} />
const ScheduleSvgGrey = () => <ScheduleComponent color={greyColor} />
const ArrowSvgGrey = () => <ArrowComponent color={greyColor} />
const TrashSvgLight = () => <TrashComponent color={secondaryColor} />
const TrashSvgGrey = () => <TrashComponent color={greyColor} />
const CrossSvgDark = () => <CrossComponent color={darkColor} />
const CloseSvgRed = () => <CloseComponent color={redColor} />
const EditSvgGrey = () => <EditComponent color={greyColor} />
const LinesSvgGrey = () => <LinesComponent color={greyColor} />
const NotificationSvgGrey = () => <NotificationComponent color={greyColor} />
const ChatSvgGrey = () => <ChatComponent color={greyColor} />
const DocSvgWhite = () => <DocComponent color={whiteColor} />
const DocSvgLight = () => <DocComponent color={secondaryColor} />
const DocSvg = () => <DocComponent color={primaryColor} />
const MoreSvgGrey = () => <MoreComponent color={greyColor} />
const EyeSvgWhite = () => <EyeComponent color={whiteColor} />
const EyeSvgGrey = () => <EyeComponent color={greyColor} />
const FileSvgWhite = () => <FileComponent color={whiteColor} />
const FileSvgGrey = () => <FileComponent color={greyColor} />
const DashboardSvg = () => <DashboardComponent color={primaryColor} />
const DashboardSvgLight = () => <DashboardComponent color={secondaryColor} />
const FriendReqSvg = () => <FriendReqComponent color={primaryColor} />
const FriendReqSvgLight = () => <FriendReqComponent color={secondaryColor} />
const SettingSvg = () => <SettingComponent color={primaryColor} />
const SettingSvgGrey = () => <SettingComponent color={greyColor} />
const SettingSvgLight = () => <SettingComponent color={secondaryColor} />
const ProjectSvg = () => <ProjectComponent color={primaryColor} />
const ProjectSvgLight = () => <ProjectComponent color={secondaryColor} />
const ProjectSvgGrey = () => <ProjectComponent color={greyColor} />
const FriendsSvgGrey = () => <FriendsComponent color={greyColor} />
const FriendsSvgLight = () => <FriendsComponent color={secondaryColor} />
const FriendsSvg = () => <FriendsComponent color={primaryColor} />
const FriendSvgGrey = () => <FriendComponent color={greyColor} />
const FriendSvgLight = () => <FriendComponent color={secondaryColor} />
const FriendSvg = () => <FriendComponent color={primaryColor} />
const SearchSvgGrey = () => <SearchComponent color={greyColor} />
const PlusSvg = () => <PlusComponent color={primaryColor} />
const PlusSvgGrey = () => <PlusComponent color={greyColor} />
const FilterSvgGrey = () => <FilterComponent color={greyColor} />
const CardViewSvg = () => <CardViewComponent color={primaryColor} />
const CardViewSvgGrey = () => <CardViewComponent color={greyColor} />
const ListViewSvg = () => <ListViewComponent color={primaryColor} />
const ListViewSvgGrey = () => <ListViewComponent color={greyColor} />

export const RightChevronIconGrey = ({ currentSlide, slideCount, ...props }) => <Icon component={RightChevronSvgGrey} {...props} />
export const LeftChevronIconGrey = ({ currentSlide, slideCount, ...props }) => <Icon component={LeftChevronSvgGrey} {...props} />
export const ScheduleIcon = props => <Icon component={ScheduleSvg} {...props} />
export const ScheduleIconGrey = props => <Icon component={ScheduleSvgGrey} {...props} />
export const TrashIconLight = props => <Icon component={TrashSvgLight} {...props} />
export const TrashIconGrey = props => <Icon component={TrashSvgGrey} {...props} />
export const EditIconGrey = props => <Icon component={EditSvgGrey} {...props} />
export const LinesIconGrey = props => <Icon component={LinesSvgGrey} {...props} />
export const NotificationIconGrey = props => <Icon component={NotificationSvgGrey} {...props} />
export const ChatIconGrey = props => <Icon component={ChatSvgGrey} {...props} />
export const DocIconWhite = props => <Icon component={DocSvgWhite} {...props} />
export const DocIconLight = props => <Icon component={DocSvgLight} {...props} />
export const DocIcon = props => <Icon component={DocSvg} {...props} />
export const MoreIconGrey = props => <Icon component={MoreSvgGrey} {...props} />
export const EyeIconWhite = props => <Icon component={EyeSvgWhite} {...props} />
export const EyeIconGrey = props => <Icon component={EyeSvgGrey} {...props} />
export const FileIconWhite = props => <Icon component={FileSvgWhite} {...props} />
export const FileIconGrey = props => <Icon component={FileSvgGrey} {...props} />
export const ListViewIcon = props => <Icon component={ListViewSvg} {...props} />
export const ListViewIconGrey = props => <Icon component={ListViewSvgGrey} {...props} />
export const CardViewIcon = props => <Icon component={CardViewSvg} {...props} />
export const CardViewIconGrey = props => <Icon component={CardViewSvgGrey} {...props} />
export const ArrowIconGrey = props => <Icon component={ArrowSvgGrey} {...props} />
export const ArrowIcon = props => <Icon component={ArrowSvg} {...props} />
export const CrossIconDark = props => <Icon component={CrossSvgDark} {...props} />
export const CloseIconRed = props => <Icon component={CloseSvgRed} {...props} />
export const BlockIconGrey = props => <Icon component={BlockSvgGrey} {...props} />
export const PlusIcon = props => <Icon component={PlusSvg} {...props} />
export const PlusIconGrey = props => <Icon component={PlusSvgGrey} {...props} />
export const FilterIconGrey = props => <Icon component={FilterSvgGrey} {...props} />
export const DDownIcon = props => <Icon component={DDownSvg} {...props} />
export const DashboardIcon = props => <Icon component={DashboardSvg} {...props} />
export const DashboardIconLight = props => <Icon component={DashboardSvgLight} {...props} />
export const SettingIcon = props => <Icon component={SettingSvg} {...props} />
export const SettingIconGrey = props => <Icon component={SettingSvgGrey} {...props} />
export const SettingIconLight = props => <Icon component={SettingSvgLight} {...props} />
export const FriendReqIcon = props => <Icon component={FriendReqSvg} {...props} />
export const FriendReqIconLight = props => <Icon component={FriendReqSvgLight} {...props} />
export const ProjectIcon = props => <Icon component={ProjectSvg} {...props} />
export const ProjectIconLight = props => <Icon component={ProjectSvgLight} {...props} />
export const ProjectIconGrey = props => <Icon component={ProjectSvgGrey} {...props} />
export const FriendsIcon = props => <Icon component={FriendsSvg} {...props} />
export const FriendsIconLight = props => <Icon component={FriendsSvgLight} {...props} />
export const FriendsIconGrey = props => <Icon component={FriendsSvgGrey} {...props} />
export const FriendIconGrey = props => <Icon component={FriendSvgGrey} {...props} />
export const FriendIcon = props => <Icon component={FriendSvg} {...props} />
export const FriendIconLight = props => <Icon component={FriendSvgLight} {...props} />
export const SearchIconGrey = props => <Icon component={SearchSvgGrey} {...props} />
