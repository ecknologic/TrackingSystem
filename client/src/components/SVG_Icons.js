import React from 'react'
import Icon from '@ant-design/icons'
const primaryColor = '#0062FF'
const secondaryColor = '#5C63AB'
const purpleColor = '#4F63BC'
const greyColor = '#92929D'
const darkColor = '#4A4A4A'
const whiteColor = '#FFFFFF'
const redColor = '#FC5A5A'
const dangerColor = '#E84A50'
const greenColor = '#2DB744'

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
        <g fill="none" fillRule="evenodd">
            <path fill={color} d="M7 0h8a7 7 0 017 7v8a7 7 0 01-7 7H7a7 7 0 01-7-7V7a7 7 0 017-7z" />
            <path fill="#FFF" d="M9.41 10.83L7.3 8.7a1 1 0 011.42-1.42l2.12 2.12 2.12-2.12a1 1 0 111.41 1.42l-2.12 2.12 2.12 2.12a1 1 0 11-1.41 1.41l-2.12-2.12-2.12 2.12a1 1 0 01-1.42-1.41l2.12-2.12z" />
        </g>
    </svg>
)
const BlockComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M16.64 14.46a8 8 0 00-11.1-11.1l11.1 11.1zm-1.31 1.5L4.03 4.69a8 8 0 0011.3 11.3v-.01zM10 0a10 10 0 110 20 10 10 0 010-20z" />
    </svg>
)
const TickComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12">
        <path fill={color} fillRule="evenodd" d="M1.7 3.97A1 1 0 00.3 5.4l5.82 5.77a1 1 0 001.46-.06l8.18-9.45a1 1 0 00-1.52-1.3L6.77 8.99 1.7 3.97z" />
    </svg>
)
const SendComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22">
        <path fill={color} fillRule="evenodd" d="M10.51 19.76l-.9 1.46a1 1 0 01-.2.24 2.4 2.4 0 01-3.16-.1 2.05 2.05 0 01-.66-1.57v-3.85l-4.4-3.58a3.22 3.22 0 01.87-5.5L19.63.07a.97.97 0 01.91.1 1 1 0 01.42 1.11l-4.79 17.26a3.23 3.23 0 01-5.14 1.64l-.52-.42zm-1.57-1.27L7.6 17.4v2.45c0 .01 0 .04.04.07.1.09.26.1.4.06l.91-1.49zm-.83-3.23l4.18 3.36a1.23 1.23 0 001.96-.61l3.7-13.33L8.1 15.26zm-1.63-1.18L16.32 3.5 2.78 8.73a1.22 1.22 0 00-.33 2.08l4.03 3.27z" />
    </svg>
)
const BiboComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="104" height="43">
        <defs>
            <filter id="a">
                <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.000000 0 0 0 0 0.384314 0 0 0 0 1.000000 0 0 0 1.000000 0" />
            </filter>
            <filter id="b">
                <feColorMatrix in="SourceGraphic" values="0 0 0 0 0.968627 0 0 0 0 0.282353 0 0 0 0 0.043137 0 0 0 1.000000 0" />
            </filter>
            <path id="c" d="M.58.55h25.07V25H.58z" />
        </defs>
        <g fill="none" fillRule="evenodd">
            <g filter="url(#a)">
                <g filter="url(#b)">
                    <path fill="#0091FF" d="M39 31.7L44.26.07 53 0l-1.92 11.3a10.2 10.2 0 013.03-2.88 7.11 7.11 0 013.57-.94 6.35 6.35 0 015.27 2.54c1.35 1.7 2.04 3.95 2.06 6.72.01 2.03-.24 3.96-.77 5.8a16.16 16.16 0 01-2.34 4.9 10.7 10.7 0 01-3.79 3.37A10.69 10.69 0 0153.16 32a8.84 8.84 0 01-4.68-1.11 7.13 7.13 0 01-2.88-3.37l-2.57 4.15-4.03.03zm14.52-18.65c-.66 0-1.28.24-1.84.73-.57.47-.97 1.1-1.2 1.85a29.94 29.94 0 00-1.35 8.22c0 .86.25 1.53.72 2.03.48.49 1.12.73 1.92.73 1.31-.01 2.37-.92 3.18-2.72.8-1.8 1.2-4.16 1.18-7.08-.01-1.26-.23-2.2-.66-2.83-.44-.63-1.09-.94-1.95-.93zM28 31l3.88-22.93L41 8l-3.9 22.93zM32 6L33.04.07 42 0l-1.01 5.93zM0 31L5.26.1l12.9-.1c3.63-.02 6.34.58 8.13 1.83 1.78 1.25 2.7 3.16 2.71 5.73a6.96 6.96 0 01-1.83 4.96 8.55 8.55 0 01-5.07 2.52 7.68 7.68 0 014.11 2.6 7.17 7.17 0 011.49 4.53 7.52 7.52 0 01-2.95 6.35c-1.98 1.54-4.76 2.33-8.32 2.36L0 31zm9.72-6.61l4.64-.04c1.5 0 2.63-.3 3.43-.87a2.79 2.79 0 001.18-2.42c0-1.06-.36-1.85-1.06-2.4-.7-.55-1.74-.81-3.1-.8l-3.97.03-1.12 6.5zm2.06-12.24l4.4-.04a4.75 4.75 0 002.96-.84 2.76 2.76 0 001.04-2.31c0-.83-.3-1.47-.88-1.94a3.71 3.71 0 00-2.4-.68l-4.14.03-.98 5.78z" />
                    <g transform="translate(65 7)">
                        <mask id="d" fill="#fff">
                            <use xlinkHref="#c" />
                        </mask>
                        <path fill="#0091FF" d="M12.55 25c-3.54.03-6.41-.96-8.62-2.94a10.14 10.14 0 01-3.35-7.8c-.01-2.13.4-4.06 1.22-5.83a16.33 16.33 0 013.92-5.07c.93-.86 2.12-1.53 3.59-2.04a14.4 14.4 0 014.54-.77c3.51-.02 6.36.94 8.52 2.9 2.16 1.96 3.25 4.55 3.28 7.79.01 2.01-.34 3.89-1.08 5.6a15.52 15.52 0 01-3.39 4.9c-1 1-2.28 1.79-3.82 2.37-1.54.58-3.13.88-4.8.89m-2.84-9.56c0 1.21.24 2.13.7 2.76a2.3 2.3 0 002 .95c1.19-.01 2.17-.9 2.97-2.65.8-1.75 1.19-3.94 1.17-6.53a4.4 4.4 0 00-.73-2.7 2.42 2.42 0 00-2.07-.93c-1.14 0-2.11.89-2.9 2.62a15.52 15.52 0 00-1.14 6.48" mask="url(#d)" />
                    </g>
                </g>
            </g>
            <path fill="#8E8A8A" fill-opacity=".85" fillRule="nonzero" d="M3.7 42.14a3.2 3.2 0 002.57-1.18h.01l-.86-.81c-.22.27-.47.47-.74.62a2.27 2.27 0 01-1.8.06 2.05 2.05 0 01-1.16-1.14 2.35 2.35 0 01-.17-.91c0-.34.05-.64.17-.92a2.05 2.05 0 011.15-1.14 2.27 2.27 0 011.73.04c.25.13.47.31.67.53l.85-.82c-.3-.35-.66-.6-1.05-.79-.4-.18-.85-.27-1.36-.27a3.4 3.4 0 00-2.4.97 3.32 3.32 0 00-.98 2.4 3.37 3.37 0 002.04 3.1c.41.18.86.26 1.34.26zM8.3 42v-2.15c0-.18.02-.35.07-.51.04-.16.1-.3.2-.42a.88.88 0 01.75-.39c.25 0 .46.08.6.24.14.16.21.4.21.7V42h1.18v-2.67c0-.59-.13-1.04-.4-1.38-.28-.34-.7-.5-1.27-.5a1.58 1.58 0 00-1.34.72h-.07l.07-.8v-1.81H7.1V42h1.18zm6.07.14c.35 0 .66-.05.94-.17a2.23 2.23 0 001.4-2.17c0-.35-.05-.66-.17-.95a2.22 2.22 0 00-2.17-1.4c-.34 0-.65.05-.94.17a2.23 2.23 0 00-1.4 2.18c0 .34.06.65.18.94a2.22 2.22 0 002.16 1.4zm0-1.09a1.14 1.14 0 01-.8-.33c-.11-.1-.2-.24-.26-.4a1.4 1.4 0 01-.1-.52c0-.2.03-.38.1-.54a1.17 1.17 0 01.62-.64 1.14 1.14 0 01.88 0 1.11 1.11 0 01.63.64c.06.16.1.34.1.54s-.04.37-.1.53a1.11 1.11 0 01-1.07.73zm5.19 1.1c.34 0 .65-.06.94-.18a2.23 2.23 0 001.4-2.17c0-.35-.06-.66-.18-.95a2.22 2.22 0 00-2.16-1.4c-.34 0-.66.05-.94.17a2.23 2.23 0 00-1.4 2.18c0 .34.06.65.17.94a2.22 2.22 0 002.17 1.4zm0-1.1a1.14 1.14 0 01-.81-.33c-.11-.1-.2-.24-.26-.4a1.4 1.4 0 01-.1-.52c0-.2.04-.38.1-.54a1.17 1.17 0 01.63-.64 1.14 1.14 0 01.87 0 1.11 1.11 0 01.63.64c.07.16.1.34.1.54s-.03.37-.1.53c-.06.15-.14.28-.25.4a1.11 1.11 0 01-.81.33zm4.84 1.1c.28 0 .54-.05.77-.12.23-.08.43-.19.6-.32.16-.14.29-.3.38-.47.09-.17.13-.35.13-.55 0-.32-.1-.6-.33-.84-.22-.23-.55-.4-1-.51l-.68-.17c-.18-.04-.32-.1-.42-.16-.1-.06-.16-.14-.16-.24 0-.1.06-.2.19-.27a.9.9 0 01.44-.1c.16 0 .32.04.49.12.16.07.28.2.36.38l1.02-.42c-.16-.36-.4-.62-.73-.79-.33-.16-.7-.24-1.12-.24-.25 0-.49.03-.7.09-.23.06-.42.15-.58.27a1.3 1.3 0 00-.38.43c-.1.17-.14.36-.14.57 0 .2.04.36.11.5.08.15.18.27.3.38a2.17 2.17 0 00.83.4l.62.13c.26.06.44.13.54.2.11.08.16.17.16.3 0 .1-.06.2-.19.27a.97.97 0 01-.51.12 1.03 1.03 0 01-.98-.68l-1.05.45a1.95 1.95 0 001.26 1.16c.23.07.48.1.77.1zm4.69 0a2.29 2.29 0 002.09-1.21l-.98-.49c-.1.19-.25.34-.42.47-.18.12-.4.18-.67.18-.14 0-.28-.02-.4-.06a1.08 1.08 0 01-.65-.51 1.24 1.24 0 01-.15-.47h3.32a.5.5 0 01.01-.1.6.6 0 010-.1v-.1c0-.33-.04-.64-.14-.92a1.93 1.93 0 00-1.12-1.22 2.4 2.4 0 00-.94-.17 2.22 2.22 0 00-1.64.7 2.41 2.41 0 00-.65 1.65 2.24 2.24 0 002.34 2.35zm1.02-2.92h-2.14a1.08 1.08 0 011.07-.82c.18 0 .34.03.47.08a.92.92 0 01.6.74zM38.06 42v-1.15h-2.73v-5.3h-1.21V42h3.94zm1.38-5.05c.2 0 .39-.07.54-.22a.72.72 0 00.22-.53.72.72 0 00-.22-.54.74.74 0 00-.54-.22.75.75 0 00-.54.22.76.76 0 00-.22.54.74.74 0 00.47.7c.09.03.19.05.29.05zm.6 5.05v-4.41h-1.19V42h1.18zm2.76 0v-3.4h1.1v-1.01h-1.1v-.36c0-.2.05-.35.15-.46.1-.11.24-.17.41-.17.1 0 .19 0 .26.03l.2.07.33-1.05a2.1 2.1 0 00-.86-.17c-.25 0-.47.04-.67.12a1.4 1.4 0 00-.88.85c-.08.2-.12.44-.12.7v.44h-.8v1h.8V42h1.18zm3.97.14a2.29 2.29 0 002.1-1.2l-.99-.49c-.1.19-.24.34-.42.47-.18.12-.4.18-.67.18-.14 0-.27-.02-.4-.06a1.08 1.08 0 01-.65-.51 1.24 1.24 0 01-.15-.47h3.32a.5.5 0 01.01-.1.6.6 0 01.01-.1v-.1c0-.33-.05-.64-.14-.92a1.93 1.93 0 00-1.12-1.22 2.4 2.4 0 00-.94-.17 2.22 2.22 0 00-1.65.7 2.41 2.41 0 00-.65 1.65c0 .34.06.65.18.94a2.24 2.24 0 002.16 1.4zm1.02-2.91h-2.13a1.08 1.08 0 011.07-.82c.18 0 .33.03.46.08s.24.12.33.2a.92.92 0 01.27.54zM55.97 42c.51 0 .97-.08 1.38-.23a2.83 2.83 0 001.7-1.67c.16-.4.23-.84.23-1.32 0-.48-.07-.91-.23-1.3a2.88 2.88 0 00-1.7-1.69c-.41-.16-.87-.23-1.38-.23H53.8V42h2.18zm-.05-1.15H55V36.7h.9c.36 0 .67.05.94.15.27.1.5.23.68.41.18.18.31.4.4.66.1.25.14.54.14.85 0 .31-.05.6-.14.85a1.72 1.72 0 01-1.08 1.07c-.27.1-.58.15-.93.15zM61.3 42v-2.16c0-.18.02-.35.08-.5.05-.15.12-.29.21-.4a.97.97 0 01.78-.36 1.12 1.12 0 01.56.12l.31-1.07a1.07 1.07 0 00-.28-.12 1.55 1.55 0 00-1.14.16c-.11.07-.22.14-.3.23-.1.1-.17.2-.22.3h-.07v-.61h-1.11V42h1.18zm3.14-5.05c.21 0 .39-.07.54-.22a.72.72 0 00.22-.53.72.72 0 00-.22-.54.74.74 0 00-.54-.22.75.75 0 00-.54.22.76.76 0 00-.22.54.74.74 0 00.47.7c.09.03.19.05.29.05zm.6 5.05v-4.41h-1.19V42h1.18zm2.25 0v-2.16c0-.18.03-.35.07-.5.05-.17.11-.3.2-.42a1 1 0 01.31-.28c.13-.07.27-.1.43-.1.27 0 .48.07.62.22.14.16.2.4.2.71V42h1.19v-2.67c0-.28-.04-.54-.1-.77a1.69 1.69 0 00-.31-.6c-.14-.16-.3-.29-.52-.38a1.84 1.84 0 00-.73-.13c-.3 0-.57.06-.8.19-.23.13-.42.3-.56.53h-.07v-.58h-1.1V42h1.17zm5.17 0v-1.42l.52-.52 1.2 1.94h1.4v-.07l-1.77-2.67 1.64-1.6v-.07h-1.46l-1.48 1.48h-.05v-3.51h-1.18V42h1.18zm8.16 0l1.01-3.1.19-.72h.07l.19.72 1 3.1h1.18l1.7-6.44h-1.28l-.94 3.76-.13.68h-.07l-.18-.68-.94-2.9H81.3l-.93 2.9-.19.7h-.07l-.14-.7-1-3.76h-1.29L79.45 42h1.17zm7.4.14c.3 0 .55-.06.74-.18.2-.12.36-.26.5-.43h.07V42h1.17v-2.65c0-.63-.19-1.1-.55-1.42-.36-.32-.88-.48-1.56-.48-.81 0-1.45.29-1.92.88l.86.58a1.3 1.3 0 011.03-.51c.28 0 .5.08.7.23.18.15.27.35.27.58v.13a3.1 3.1 0 00-1.89-.1c-.21.07-.4.17-.56.3a1.38 1.38 0 00-.51 1.09 1.39 1.39 0 00.48 1.09c.14.13.32.24.52.31.2.08.41.11.64.11zm.25-.91a.84.84 0 01-.5-.17.51.51 0 01-.23-.43c0-.18.08-.33.23-.45.16-.13.37-.19.66-.19a1.87 1.87 0 01.9.22.99.99 0 01-.29.7 1.07 1.07 0 01-.77.32zm5.11.84c.2 0 .37-.01.53-.05.16-.03.3-.08.45-.15l-.34-1.03a.76.76 0 01-.17.08.76.76 0 01-.24.04c-.16 0-.28-.05-.36-.15a.46.46 0 01-.12-.22 1.2 1.2 0 01-.03-.28V38.6h1.08v-1.01H93.1v-1.35h-1.18v1.35h-.78v1h.78v1.94c0 .5.14.88.42 1.16.12.12.27.21.45.28.17.07.37.1.6.1zm3.75.07a2.29 2.29 0 002.09-1.2l-.98-.49c-.1.19-.25.34-.42.47-.18.12-.4.18-.67.18-.14 0-.28-.02-.4-.06a1.08 1.08 0 01-.65-.51 1.24 1.24 0 01-.15-.47h3.32a.5.5 0 010-.1.6.6 0 01.02-.1v-.1c0-.33-.05-.64-.15-.92a1.93 1.93 0 00-1.12-1.22 2.4 2.4 0 00-.94-.17 2.22 2.22 0 00-1.64.7 2.41 2.41 0 00-.65 1.65 2.24 2.24 0 002.34 2.35zm1.02-2.91H96a1.08 1.08 0 011.07-.82c.18 0 .34.03.47.08a.92.92 0 01.6.74zm3.07 2.77v-2.16c0-.18.03-.35.08-.5.05-.15.12-.29.22-.4a.97.97 0 01.77-.36 1.12 1.12 0 01.56.12l.32-1.07a1.07 1.07 0 00-.29-.12 1.55 1.55 0 00-1.14.16c-.11.07-.21.14-.3.23-.1.1-.16.2-.22.3h-.07v-.61h-1.1V42h1.17z" />
        </g>
    </svg>
)
const LocationComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill={color} fillRule="evenodd" d="M12 2c4.97 0 9 3.97 9 8.87 0 2.42-1 4.69-2.7 6.34l-5.6 5.5a1 1 0 01-1.4 0l-5.6-5.5A8.78 8.78 0 013 10.86C3 5.97 7.03 2 12 2zm0 2c-3.87 0-7 3.08-7 6.87 0 1.87.76 3.61 2.1 4.9L12 20.6l4.9-4.82a6.78 6.78 0 002.1-4.91C19 7.08 15.87 4 12 4zm0 3a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
)
const BlocksComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24">
        <g fill={color} fillRule="nonzero" stroke="#5C63AB">
            <path stroke-width=".5" d="M17.66 12.46H7.34a.57.57 0 01-.57-.57V1.57c0-.31.25-.57.57-.57h10.32c.32 0 .57.26.57.57V11.9c0 .32-.25.57-.57.57zM7.9 11.32h9.18V2.15H7.9v9.17z" />
            <path stroke-width=".3" d="M14.22 5.59h-3.44a.57.57 0 01-.57-.58V1.57c0-.31.25-.57.57-.57h3.44c.32 0 .57.26.57.57v3.44c0 .32-.25.58-.57.58zm-2.87-1.15h2.3v-2.3h-2.3v2.3z" />
            <path stroke-width=".4" d="M12.5 22.78H1.6a.57.57 0 01-.56-.57V11.89c0-.32.25-.57.57-.57H12.5c.32 0 .57.25.57.57v10.32c0 .32-.25.57-.57.57zM2.18 21.64h9.75v-9.18H2.18v9.18z" />
            <path stroke-width=".3" d="M8.49 15.9H5.05a.57.57 0 01-.57-.57v-3.44c0-.32.25-.57.57-.57h3.44c.31 0 .57.25.57.57v3.44c0 .32-.26.57-.57.57zm-2.87-1.14h2.3v-2.3h-2.3v2.3z" />
            <path stroke-width=".5" d="M23.4 22.78H12.5a.57.57 0 01-.57-.57V11.89c0-.32.25-.57.57-.57h10.9c.3 0 .56.25.56.57v10.32c0 .32-.25.57-.57.57zm-10.33-1.14h9.75v-9.18h-9.75v9.18z" />
            <path stroke-width=".3" d="M19.95 15.9h-3.44a.57.57 0 01-.57-.57v-3.44c0-.32.26-.57.57-.57h3.44c.32 0 .58.25.58.57v3.44c0 .32-.26.57-.58.57zm-2.86-1.14h2.29v-2.3h-2.3v2.3z" />
        </g>
    </svg>
)
const StockComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M6.5 3.8a1 1 0 01-2 0H2v1.6h16V3.8h-1.6a1 1 0 01-2 0H6.5zm0 0h7.9-7.9zm-2-2V1a1 1 0 112 0v.8h7.9V1a1 1 0 012 0v.8h1.7c1.05 0 1.9.85 1.9 1.9V17a3 3 0 01-3 3H3a3 3 0 01-3-3V3.7c0-1.05.85-1.9 1.9-1.9h2.6zM18 7.4H2V17a1 1 0 001 1h14a1 1 0 001-1V7.4zM4.6 11a1 1 0 010-2h3.6a1 1 0 010 2H4.6zm0 3.6a1 1 0 010-2h7.2a1 1 0 010 2H4.6z" />
    </svg>
)
const ReportComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M4 0h12a4 4 0 014 4v12a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4zm0 2a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4a1 1 0 110-2h10a1 1 0 010 2H5zm0 5a1 1 0 010-2h10a1 1 0 010 2H5zm0 5a1 1 0 010-2h5a1 1 0 010 2H5z" />
    </svg>
)
const BadgeComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23">
        <g fill="none" fillRule="evenodd">
            <path d="M-5-2h28v28H-5z" />
            <path fill={color} d="M9.9.33a7.93 7.93 0 016.85 11.92l2.4 6.61c.13.36.15.76.06 1.13a1.94 1.94 0 01-2.35 1.44l-1.23-.3-.8 1.09a1.94 1.94 0 01-3.37-.41L9.9 18.1l-1.55 3.7a1.96 1.96 0 01-2.41 1.11l-.14-.05c-.33-.14-.61-.36-.82-.65l-.8-1.1-1.23.31a1.94 1.94 0 01-2.29-2.57l2.38-6.57A7.93 7.93 0 019.9.34zM4.67 14.27l-1.77 4.9 2.2-.55 1.4 1.92 1.86-4.46a7.87 7.87 0 01-3.69-1.81zm10.45-.03a7.88 7.88 0 01-3.68 1.84l1.86 4.46 1.4-1.92 2.2.54zM9.89 2.56a5.72 5.72 0 10.02 11.43 5.72 5.72 0 00-.02-11.43zm-.3 1.1a5.37 5.37 0 015.35 5.4c0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1a3.16 3.16 0 00-3.16-3.17c-.6 0-1.1-.5-1.1-1.11 0-.62.5-1.11 1.1-1.11z" />
        </g>
    </svg>
)
const RibbonComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M9 2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V4a2 2 0 00-1.6-1.96V10a1 1 0 01-1.4.92l-2.28-1-2.33 1A1 1 0 019 10V2zM4 0h12a4 4 0 014 4v12a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4zm5.1 13.5a1 1 0 010 2H4.6a1 1 0 010-2h4.5zM6.4 9.9a1 1 0 010 2H4.6a1 1 0 010-2h1.8zM11 2v6.48l1.33-.56a1 1 0 01.8 0l1.27.55V2H11z" />
    </svg>
)
const CheckComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fillRule="evenodd" d="M10.26 11.47L18.2 1.38a1 1 0 011.58 1.24l-8.68 11a1 1 0 01-1.5.07L5.27 9.13a1 1 0 111.44-1.37l3.54 3.71zM18 9.1a1 1 0 012 0v7.2a3.7 3.7 0 01-3.7 3.7H3.7A3.7 3.7 0 010 16.3V3.7A3.7 3.7 0 013.7 0h10.7a1 1 0 010 2H3.7C2.76 2 2 2.76 2 3.7v12.6c0 .94.76 1.7 1.7 1.7h12.6c.94 0 1.7-.76 1.7-1.7V9.1z" />
    </svg>
)
const StackComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21">
        <path fill={color} fillRule="evenodd" d="M6.3 12.2V8.8H2v3.4h4.3zm2 0H18V8.8H8.3v3.4zm-2-9.7H3a1 1 0 00-1 1v3.3h4.3V2.5zm2 0v4.3H18V3.5a1 1 0 00-1-1H8.3zm-2 16v-4.3H2v3.3a1 1 0 001 1h3.3zm2 0H17a1 1 0 001-1v-3.3H8.3v4.3zm-8.3-1v-14a3 3 0 013-3h14a3 3 0 013 3v14a3 3 0 01-3 3H3a3 3 0 01-3-3z" />
    </svg>
)
const HomeComponent = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path fill={color} fill-rule="evenodd" d="M17.1 8.3h-.39c-.73 0-1.4-.26-1.92-.69-.51.43-1.18.69-1.91.69h-.96c-.73 0-1.4-.26-1.92-.69-.52.43-1.19.69-1.92.69h-.96c-.73 0-1.4-.26-1.91-.69-.52.43-1.2.69-1.92.69H2.9V18H7v-6a1 1 0 011-1h4.5a1 1 0 011 1v6h3.6V8.3zm2-.72V18.1a1.9 1.9 0 01-1.9 1.9H2.8a1.9 1.9 0 01-1.9-1.9V7.58a2.64 2.64 0 01-.79-2.73l1.05-3.43A2 2 0 013.07 0h13.86a2 2 0 011.91 1.42l1.05 3.43a2.62 2.62 0 01-.79 2.73zM11.5 18v-5H9v5h2.5zm6.47-12.57L16.93 2H3.07L2.03 5.43A.6.6 0 002 5.6c0 .37.35.7.8.7h.49c.52 0 .92-.37.92-.8 0-1.33 2-1.33 2 0 0 .43.4.8.91.8h.96c.52 0 .92-.37.92-.8 0-1.33 2-1.33 2 0 0 .43.4.8.92.8h.96c.52 0 .91-.37.91-.8 0-1.33 2-1.33 2 0 0 .43.4.8.92.8h.48l.24-.03c.42-.12.65-.5.54-.84z" />
    </svg>
)
const XLSComponent = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
        <path fill="#eceff1" d="M496 432.01H272c-8.83 0-16-7.17-16-16v-320a16 16 0 0116-16h224a16 16 0 0116 16v320a16 16 0 01-16 16z" />
        <g fill="#388e3c">
            <path d="M336 176.01h-64a16 16 0 010-32h64a16 16 0 010 32zM336 240.01h-64a16 16 0 010-32h64a16 16 0 010 32zM336 304.01h-64a16 16 0 010-32h64a16 16 0 010 32zM336 368.01h-64a16 16 0 010-32h64a16 16 0 010 32zM432 176.01h-32a16 16 0 010-32h32a16 16 0 010 32zM432 240.01h-32a16 16 0 010-32h32a16 16 0 010 32zM432 304.01h-32a16 16 0 010-32h32a16 16 0 010 32zM432 368.01h-32a16 16 0 010-32h32a16 16 0 010 32z" />
        </g>
        <path fill="#2e7d32" d="M282.2 19.7a15.72 15.72 0 00-13.14-3.4l-256 48C5.47 65.7 0 72.3 0 80v352c0 7.68 5.47 14.3 13.06 15.71l256 48a15.93 15.93 0 0013.15-3.4 16 16 0 005.79-12.3v-448c0-4.78-2.11-9.29-5.8-12.33z" />
        <path fill="#fafafa" d="M220.03 309.48l-50.59-57.82 51.17-65.8a16.03 16.03 0 00-2.79-22.46 16.03 16.03 0 00-22.46 2.79l-47.4 60.92-39.93-45.63a15.92 15.92 0 00-22.56-1.5 15.97 15.97 0 00-1.5 22.56l44 50.3-44.61 57.35a16.03 16.03 0 002.78 22.46 16.1 16.1 0 0022.5-2.81l40.8-52.48 46.53 53.15a15.94 15.94 0 0022.56 1.54 15.97 15.97 0 001.5-22.57z" />
    </svg>
)

const BiboSvg = () => <BiboComponent />
const XLSSvg = () => <XLSComponent />
const RightChevronSvgLight = () => <RightChevronComponent color={purpleColor} />
const RightChevronSvgGrey = () => <RightChevronComponent color={greyColor} />
const LeftChevronSvgGrey = () => <LeftChevronComponent color={greyColor} />
const BlockSvgGrey = () => <BlockComponent color={greyColor} />
const SendSvgGrey = () => <SendComponent color={greyColor} />
const ArrowSvg = () => <ArrowComponent color={primaryColor} />
const ArrowSvgGrey = () => <ArrowComponent color={greyColor} />
const ArrowSvgDanger = () => <ArrowComponent color={dangerColor} />
const ArrowSvgGreen = () => <ArrowComponent color={greenColor} />
const ScheduleSvg = () => <ScheduleComponent color={primaryColor} />
const ScheduleSvgGrey = () => <ScheduleComponent color={greyColor} />
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
const DocSvgGrey = () => <DocComponent color={greyColor} />
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
const TickSvgGrey = () => <TickComponent color={greyColor} />
const LocationSvgLight = () => <LocationComponent color={secondaryColor} />
const LocationSvg = () => <LocationComponent color={primaryColor} />
const BlocksSvgLight = () => <BlocksComponent color={secondaryColor} />
const BlocksSvg = () => <BlocksComponent color={primaryColor} />
const StockSvgLight = () => <StockComponent color={secondaryColor} />
const StockSvg = () => <StockComponent color={primaryColor} />
const ReportSvgLight = () => <ReportComponent color={secondaryColor} />
const ReportSvg = () => <ReportComponent color={primaryColor} />
const BadgeSvgLight = () => <BadgeComponent color={secondaryColor} />
const BadgeSvg = () => <BadgeComponent color={primaryColor} />
const RibbonSvgLight = () => <RibbonComponent color={secondaryColor} />
const RibbonSvg = () => <RibbonComponent color={primaryColor} />
const CheckSvgLight = () => <CheckComponent color={secondaryColor} />
const CheckSvg = () => <CheckComponent color={primaryColor} />
const StackSvgLight = () => <StackComponent color={secondaryColor} />
const StackSvg = () => <StackComponent color={primaryColor} />
const HomeSvgLight = () => <HomeComponent color={secondaryColor} />
const HomeSvg = () => <HomeComponent color={primaryColor} />

export const RightChevronIconGrey = ({ currentSlide, slideCount, ...props }) => <Icon component={RightChevronSvgGrey} {...props} />
export const LeftChevronIconGrey = ({ currentSlide, slideCount, ...props }) => <Icon component={LeftChevronSvgGrey} {...props} />
export const RightChevronIconLight = props => <Icon component={RightChevronSvgLight} {...props} />
export const SendIconGrey = props => <Icon component={SendSvgGrey} {...props} />
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
export const DocIconGrey = props => <Icon component={DocSvgGrey} {...props} />
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
export const ArrowIconDanger = props => <Icon component={ArrowSvgDanger} {...props} />
export const ArrowIconGreen = props => <Icon component={ArrowSvgGreen} {...props} />
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
export const TickIconGrey = props => <Icon component={TickSvgGrey} {...props} />
export const BiboIcon = props => <Icon component={BiboSvg} {...props} />
export const LocationIconLight = props => <Icon component={LocationSvgLight} {...props} />
export const LocationIcon = props => <Icon component={LocationSvg} {...props} />
export const BlocksIconLight = props => <Icon component={BlocksSvgLight} {...props} />
export const BlocksIcon = props => <Icon component={BlocksSvg} {...props} />
export const StockIconLight = props => <Icon component={StockSvgLight} {...props} />
export const StockIcon = props => <Icon component={StockSvg} {...props} />
export const ReportIconLight = props => <Icon component={ReportSvgLight} {...props} />
export const ReportIcon = props => <Icon component={ReportSvg} {...props} />
export const BadgeIconLight = props => <Icon component={BadgeSvgLight} {...props} />
export const BadgeIcon = props => <Icon component={BadgeSvg} {...props} />
export const RibbonIconLight = props => <Icon component={RibbonSvgLight} {...props} />
export const RibbonIcon = props => <Icon component={RibbonSvg} {...props} />
export const CheckIconLight = props => <Icon component={CheckSvgLight} {...props} />
export const CheckIcon = props => <Icon component={CheckSvg} {...props} />
export const StackIconLight = props => <Icon component={StackSvgLight} {...props} />
export const StackIcon = props => <Icon component={StackSvg} {...props} />
export const HomeIconLight = props => <Icon component={HomeSvgLight} {...props} />
export const HomeIcon = props => <Icon component={HomeSvg} {...props} />
export const XLSIcon = props => <Icon component={XLSSvg} {...props} />
