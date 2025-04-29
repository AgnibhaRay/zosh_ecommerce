import { Button, CircularProgress, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import OTPInput from '../../components/OtpFild/OTPInput'
import { FormikValues, useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { resetAuthState, sendLoginSignupOtp, signup } from '../../../Redux Toolkit/Customer/AuthSlice';

const SignupForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);

    useEffect(() => {
        // Reset auth state when component mounts
        dispatch(resetAuthState());
        return () => {
            // Reset auth state when component unmounts
            dispatch(resetAuthState());
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            name: ""
        },
        onSubmit: (values: any) => {
            dispatch(signup({ fullName: values.name, email: values.email, otp, navigate }));
        }
    });

    const handleOtpChange = (otp: any) => {
        setOtp(otp);
    };

    const handleResendOTP = () => {
        dispatch(sendLoginSignupOtp({ email: formik.values.email }));
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        if (formik.values.email) {
            setIsOtpSent(true);
            handleResendOTP();
        }
    };

    const handleSignup = () => {
        if (otp && formik.values.name) {
            formik.handleSubmit();
        }
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
        <div>
            <h1 className='text-center font-bold text-xl text-primary-color pb-5'>Signup</h1>
            <form className="space-y-5">
                <TextField
                    fullWidth
                    name="email"
                    label="Enter Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email as string : undefined}
                    disabled={auth.otpSent}
                />

                {auth.otpSent && (
                    <div className="space-y-2">
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
                    </div>
                )}

                {auth.otpSent && (
                    <TextField
                        fullWidth
                        name="name"
                        label="Enter Your Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name ? formik.errors.name as string : undefined}
                    />
                )}

                {auth.otpSent && (
                    <div>
                        <Button
                            disabled={auth.loading || !otp || !formik.values.name}
                            onClick={handleSignup}
                            fullWidth
                            variant='contained'
                            sx={{ py: "11px" }}
                        >
                            {auth.loading ? <CircularProgress size={24} /> : "Signup"}
                        </Button>
                    </div>
                )}

                {!auth.otpSent && (
                    <Button
                        disabled={auth.loading || !formik.values.email}
                        fullWidth
                        variant='contained'
                        onClick={handleSentOtp}
                        sx={{ py: "11px" }}
                    >
                        {auth.loading ? <CircularProgress size={24} /> : "Send OTP"}
                    </Button>
                )}
            </form>
        </div>
    )
}

export default SignupForm