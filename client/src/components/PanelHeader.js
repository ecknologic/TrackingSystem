import dayjs from 'dayjs';
import React, { useState, memo } from 'react';
import PanelDropdown from './PanelDropdown';
import ReportsDropdown from './ReportsDropdown';
import { ScheduleIconGrey } from './SVG_Icons';
import { TODAYDATE } from '../utils/constants';
import CustomDateInput from './CustomDateInput';
import { calendarMenu, shiftMenu } from '../assets/fixtures';
import { disableFutureDates } from '../utils/Functions';
const fn = () => { }
const todayString = 'Today'
const weekString = 'This Week'
const monthString = 'This Month'
const customString = 'Select Date'
const DATETIMEFORMAT = 'DD/MM/YYYY h:mm A'
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const PanelHeader = memo(({ title, hideShow, hideShift, onSelect = fn }) => {
    const [show, setShow] = useState('Today')
    const [open, setOpen] = useState(false)
    const [time, setTime] = useState(() => dayjs().format(DATETIMEFORMAT))
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)

    const handleShiftSelect = (shift) => {
        onSelect({ shift })
    }

    const handleCalendarSelect = (value) => {
        const isToday = value === todayString
        const isWeek = value === weekString
        const isMonth = value === monthString
        const isCustom = value === customString

        if (isCustom) {
            setOpen(true)
            return
        }

        setShow(value)
        const endDate = dayjs().format(APIDATEFORMAT)
        let to = dayjs().format(DATEFORMAT)
        let from = dayjs(endDate).format(DATEFORMAT)
        let startDate = endDate

        if (isToday) {
            const todayFull = dayjs().format(DATETIMEFORMAT)
            setTime(todayFull)
        }
        else {
            if (isWeek) {
                startDate = dayjs().startOf('week').format(APIDATEFORMAT)
                from = dayjs(startDate).format(DATEFORMAT)
            }
            else if (isMonth) {
                startDate = dayjs().startOf('month').format(APIDATEFORMAT)
                from = dayjs(startDate).format(DATEFORMAT)
            }
            setTime(`${from} to ${to}`)
        }

        onSelect({ startDate, endDate })
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        const d = dayjs(value).format(APIDATEFORMAT)
        const time = dayjs(value).format(DATEFORMAT)
        setShow(`on ${time}`)
        setTime('')
        setSelectedDate(value)
        onSelect({ startDate: d, endDate: d })
    }

    return (
        <div className='panel-header'>
            <div className='primary'>
                <div className='head-container'>
                    <div className='title'>
                        {title} {!hideShow && show}
                    </div>
                    <div className='select-options'>
                        {
                            hideShow ? null
                                : (
                                    <>
                                        <div className='option show'>
                                            <PanelDropdown
                                                label='Show'
                                                initValue='Today'
                                                options={calendarMenu}
                                                onSelect={handleCalendarSelect}
                                            />
                                        </div>
                                        <div className='app-date-picker-wrapper'>
                                            {/* <ScheduleIconGrey onClick={() => setOpen(true)} /> */}
                                            <CustomDateInput // Hidden in the DOM
                                                open={open}
                                                value={selectedDate}
                                                style={{ left: 0 }}
                                                type='range'
                                                className='date-panel-picker'
                                                onChange={handleDateSelect}
                                                onOpenChange={datePickerStatus}
                                                disabledDate={disableFutureDates}
                                            />
                                        </div>
                                    </>
                                )
                        }
                        {
                            hideShift ? null
                                : (
                                    <div className='option'>
                                        <PanelDropdown
                                            label='Shift Type'
                                            initValue='All'
                                            options={shiftMenu}
                                            onSelect={handleShiftSelect}
                                        />
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className='date-display'>
                    <span>{time}</span>
                </div>
            </div>
            <div className='secondary'>
                <ReportsDropdown inverse />
            </div>
        </div>
    )
})

export default PanelHeader