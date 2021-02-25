import dayjs from 'dayjs';
import React, { useState, memo } from 'react';
import InputLabel from './InputLabel';
import SelectInput from './SelectInput';
import PanelDropdown from './PanelDropdown';
import ReportsDropdown from './ReportsDropdown';
import CustomRangeInput from './CustomRangeInput';
import { calendarMenu, calendarOptions, shiftMenu } from '../assets/fixtures';
const fn = () => { }
const todayString = 'Today'
const tillNowString = 'Till Now'
const weekString = 'This Week'
const monthString = 'This Month'
const customString = 'Date Range'
const DATETIMEFORMAT = 'DD/MM/YYYY h:mm A'
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const PanelHeader = memo((props) => {
    const { title, showShow, showShift, initTime = tillNowString, showDep, depName, showFooter,
        depMenu = [], depOptions = [], onSelect = fn } = props
    const [open, setOpen] = useState(false)
    const [time, setTime] = useState(() => getInitTime(initTime))
    const [selectedRange, setSelectedRange] = useState([])
    const [dateRange, setDateRange] = useState(initTime)
    const [depValue, setDepValue] = useState('All')

    const handleShiftSelect = (shift) => {
        onSelect({ shift })
    }

    function getInitTime(value) {
        const isTillNow = value === tillNowString
        const isToday = value === todayString
        const isWeek = value === weekString
        if (isToday || isTillNow) return dayjs().format(DATETIMEFORMAT)
        else if (isWeek) {
            const from = dayjs().weekday(1).format(DATEFORMAT)
            const to = dayjs().format(DATEFORMAT)
            return `${from} to ${to}`
        }
    }

    const handleDepartmentSelect = (departmentId) => {
        setDepValue(departmentId)
        onSelect({ departmentId })
    }

    const handleCalendarSelect = (value) => {
        const isTillNow = value === tillNowString
        const isToday = value === todayString
        const isWeek = value === weekString
        const isMonth = value === monthString
        const isCustom = value === customString

        if (isCustom) {
            setOpen(true)
            return
        }

        let endDate = dayjs().format(APIDATEFORMAT)
        let to = dayjs().format(DATEFORMAT)
        let from = dayjs(endDate).format(DATEFORMAT)
        const todayFull = dayjs().format(DATETIMEFORMAT)
        let startDate = endDate
        let fromStart = false

        if (isTillNow) {
            setTime(tillNowString)
            setTime(todayFull)
        }
        else if (isToday) {
            setTime(to)
        }
        else {
            if (isWeek) {
                startDate = dayjs().startOf('week').format(APIDATEFORMAT)
                endDate = dayjs().endOf('week').format(APIDATEFORMAT)
                from = dayjs(startDate).format(DATEFORMAT)
            }
            else if (isMonth) {
                startDate = dayjs().startOf('month').format(APIDATEFORMAT)
                endDate = dayjs().endOf('month').format(APIDATEFORMAT)
                from = dayjs(startDate).format(DATEFORMAT)
            }
            setTime(`${from} to ${to}`)
        }
        setSelectedRange([])
        onSelect({ startDate, endDate, fromStart, type: value })
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (selected) => {
        const [from, to] = selected
        const startDate = from.format(APIDATEFORMAT)
        const endDate = to.format(APIDATEFORMAT)
        setTime(`${from.format(DATEFORMAT)} to ${to.format(DATEFORMAT)}`)
        setOpen(false)
        setSelectedRange(selected)
        onSelect({ startDate, endDate, fromStart: false, type: '' })
        setTimeout(() => setSelectedRange([]), 820)
    }

    const handleDateInputSelect = (value) => {
        setDateRange(value)
        handleCalendarSelect(value)
    }

    return (
        <>
            <div className='panel-header'>
                <div className='primary'>
                    <div className='head-container'>
                        <div className='title'>
                            {title}
                        </div>
                        <div className='select-options'>
                            {
                                (showShow || showFooter) && (
                                    <div className='app-date-picker-wrapper'>
                                        <CustomRangeInput // Hidden in the DOM
                                            open={open}
                                            value={selectedRange}
                                            style={{ left: 0 }}
                                            type='range'
                                            className='date-panel-picker'
                                            onChange={handleDateSelect}
                                            onOpenChange={datePickerStatus}
                                        />
                                    </div>
                                )
                            }
                            {
                                showShow && (
                                    <div className='option show'>
                                        <PanelDropdown
                                            label='Show'
                                            initValue={initTime}
                                            options={calendarMenu}
                                            onSelect={handleCalendarSelect}
                                        />
                                    </div>
                                )
                            }
                            {
                                showShift ? (
                                    <div className='option'>
                                        <PanelDropdown
                                            label='Shift Type'
                                            initValue='All'
                                            options={shiftMenu}
                                            onSelect={handleShiftSelect}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                showDep ? (
                                    <div className='option'>
                                        <PanelDropdown
                                            label='Motherplant'
                                            initValue='All'
                                            options={depMenu}
                                            onSelect={handleDepartmentSelect}
                                        />
                                    </div>
                                ) : null
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
            {
                showFooter && (
                    <div className='panel-footer'>
                        <div className='row'>
                            <div className='input-container'>
                                <InputLabel name='Date Range' />
                                <SelectInput
                                    value={dateRange}
                                    options={calendarOptions}
                                    onSelect={handleDateInputSelect}
                                />
                            </div>
                            <div className='input-container'>
                                <InputLabel name={depName} />
                                <SelectInput
                                    value={depValue}
                                    options={depOptions}
                                    onSelect={handleDepartmentSelect}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
})

export default PanelHeader