import React, { useEffect } from 'react'
import { Form, Input, Card } from 'antd'
import { resetTrackForm, trackAccountFormOnce } from '../../utils/Functions';

const ChangePassword = ({ onChange, onSubmit, data, match, msg, errors }) => {
    const { password, currentPassword, confirmPassword } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className="login_component login_component_modal">
            <div className="login_container login_container_modal">
                <Card className="login_card login_card_modal">
                    <p className='fp-info'>Create a new password that is at least 8 characters long and has a combination of letters, digits and punctuation marks.</p>
                    <Form>
                        <Form.Item>
                            <h5>Current Password</h5>
                            <Input type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                autoFocus
                                onChange={(e) => onChange(e, "currentPassword")}
                            />
                            <p className="error-msg">{errors.currentPassword}</p>
                        </Form.Item>
                        <Form.Item>
                            <h5>New Password</h5>
                            <Input type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => onChange(e, "password")}
                            />
                            <p className="error-msg">{errors.password}</p>
                        </Form.Item>
                        <Form.Item>
                            <h5>Confirm New Password</h5>
                            <Input type="password"
                                onPressEnter={onSubmit}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => onChange(e, "confirmPassword")}
                            />
                            {errors.confirmPassword ? <p className="error-msg">{errors.confirmPassword}</p>
                                : <p className={match ? 'match' : 'no-match'}>{msg}</p>}
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default ChangePassword;