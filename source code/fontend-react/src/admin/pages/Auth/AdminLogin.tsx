import { Alert, Button, CircularProgress, Snackbar, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormikValues, useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import OTPInput from '../../../customer/components/OtpFild/OTPInput';
import { sendLoginSignupOtp, signin } from '../../../Redux Toolkit/Customer/AuthSlice';

const AdminLoginForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: ''
        },
        onSubmit: (values: any) => {
            dispatch(signin({ email: values.email, otp, navigate }))
        }
    });

    const handleOtpChange = (otp: string) => {
        setOtp(otp);
    };

    const handleResendOTP = () => {
        dispatch(sendLoginSignupOtp({ email: formik.values.email }))
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        setIsOtpSent(true);
        handleResendOTP();
    };

    const handleLogin = () => {
        formik.handleSubmit();
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <div className="p-5">
            <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Admin Login</h1>
            <form className="space-y-5">
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />

                {auth.otpSent && <div className="space-y-2">
                    <p className="font-medium text-sm">
                        * Enter OTP sent to your email
                    </p>
                    <OTPInput
                        length={6}
                        onChange={handleOtpChange}
                        error={false}
                    />
                    <p className="text-xs space-x-2">
                        {isTimerActive ? (
                            <span>Resend OTP in {timer} seconds</span>
                        ) : (
                            <>
                                Didn't receive OTP?{" "}
                                <span
                                    onClick={handleResendOTP}
                                    className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                >
                                    Resend OTP
                                </span>
                            </>
                        )}
                    </p>
                </div>}

                {auth.otpSent && <div>
                    <Button
                        disabled={auth.loading}
                        onClick={handleLogin}
                        fullWidth
                        variant='contained'
                        sx={{ py: "11px" }}>
                        {auth.loading ? <CircularProgress /> : "Login"}
                    </Button>
                </div>}

                {!auth.otpSent && <Button
                    disabled={auth.loading}
                    fullWidth
                    variant='contained'
                    onClick={handleSentOtp}
                    sx={{ py: "11px" }}>
                    {auth.loading ? <CircularProgress /> : "Send OTP"}
                </Button>}
            </form>
        </div>
    );
};

export default AdminLoginForm;